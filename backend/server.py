#!/usr/bin/env python3

"""
A server for submission and checking of exercises.
AUTHOR: Erel Segal-Halevi
SINCE: 2019-03
"""


import websockets, asyncio, os, json, re, sys, datetime

from terminal import *
from csv_trace import edit_csv
from csv_summary import edit_csv_summary
import datetime
from multiprocessing import Process

from concurrent.futures import ProcessPoolExecutor

PORT_NUMBER = int(sys.argv[1]) if len(sys.argv)>=2 else 5670   # same port as in frontend/index.html

EXERCISE_DIR = os.path.realpath(os.path.dirname(os.path.abspath(__file__))+"/../exercises")


# Example https: https://github.com/SamuelBismuth/badkan.git
# Example ssh: git@github.com:SamuelBismuth/badkan.git
GIT_REGEXP = re.compile(".*github[.]com.(.*)/(.*)", re.IGNORECASE)
GITLAB_REGEXP = re.compile(".*gitlab[.]com.(.*)/(.*)", re.IGNORECASE)
GIT_CLEAN  = re.compile(".git.*", re.IGNORECASE)
# Set the regular expression for detecting the grade in the file.
# This is the default regular expression:
grade_regexp = re.compile("[*].*grade.*:\\s*(\\d+).*[*]", re.IGNORECASE)   # default

async def tee(websocket, message):
    """
    Send a message both to the backend screen and to the frontend client.
    """
    print("> {}".format(message))
    await websocket.send(message)


async def docker_command(command_words):
    """
    :param command_words: a list of words to be executed by docker.
    :return: a stream that contains all output of the command (stdout and stderr together)
    """
    return await asyncio.subprocess.create_subprocess_exec(
        *(["docker"] + command_words),
        stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.STDOUT)


async def dealing_with_file(filename, websocket, owner_firebase_id, exercise):
    proc = await docker_command(["exec", "badkan", "bash", "get-submission-file.sh", owner_firebase_id, exercise])
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        await tee(websocket, line)
    await proc.wait()
    

async def dealing_with_url(git_url, websocket, owner_firebase_id, exercise):
    matches = GIT_REGEXP.search(git_url)
    username = matches.group(1)
    repository = GIT_CLEAN.sub("",matches.group(2))
    # Clone or pull the student's submission from github to the docker container "badkan":
    proc = await docker_command(["exec", "badkan", "bash", "get-submission.sh", username, repository, owner_firebase_id, exercise])
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        await tee(websocket, line)
    await proc.wait()

async def run_for_admin(owner_firebase_id, exercise_id, websocket):
    repository_folder = "/submissions/{}/{}".format(owner_firebase_id, exercise_id)
    current_exercise_dir = os.path.realpath(EXERCISE_DIR + "/" + exercise_id)
    await tee(websocket, "copying from {}".format(current_exercise_dir))
    print("DEBUD ADMIN", current_exercise_dir)
    proc = await docker_command(["cp", current_exercise_dir, "badkan:{}/grading_files".format(repository_folder)])
    async for line in proc.stdout:  print(line)
    await proc.wait()
     # Grade the submission inside the docker container "badkan"
    grade = None
    move_command = "mv grading_files/* . && rm -rf grading_files"
    TIMEOUT_SOFT = 10 # seconds
    TIMEOUT_HARD = 20 # seconds
    grade_command = "timeout -s 9 {} timeout {} nice -n 5 ./grade {} {}".format(TIMEOUT_HARD, TIMEOUT_SOFT, owner_firebase_id, exercise_id)
    exitcode_command = "echo Exit code: $?"
    combined_command = "{} && {} ; {}".format(move_command, grade_command, exitcode_command)
    proc = await docker_command(["exec", "-w", repository_folder, "badkan", "bash", "-c", combined_command])

    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        await tee(websocket, line)
        matches = grade_regexp.search(line)
        if matches is not None:
            grade = matches.group(1)
            await tee(websocket, "Final Grade: " + grade)
                    # This line is read at app/Badkan.js, in websocket.onmessage.
    await proc.wait()
    if grade is None:
        await tee(websocket, "Final Grade: 0")

async def run_all_submissions(exercise_id, users_map, websocket):
    for user in users_map:
        await tee(websocket, "THE GRADE FOR THE STUDENT WITH THE ID " + user)
        await tee(websocket, "")
        await run_for_admin(user, exercise_id, websocket)
        await tee(websocket, "######################################")
        await tee(websocket, "")
        await tee(websocket, "")
    
async def check_private_submission(websocket:object, submission:dict):
    """
    Check a private submitted solution to the given exercise from the given git_url.
    :param websocket: for reading the submission params and sending output messages.
    :param submission: a JSON object with at least the following fields:
           "exercise" - name of the exercise; represents a sub-folder of the "exercises" folder.
           "git_url"  - a url for cloning the student's git repository containing the submitted solution.
           must be of the form https://xxx.git.
    """    
    solution=submission["solution"]
    tokenUsername=submission["tokenUsername"]
    tokenPassword=submission["tokenPassword"]
    exercise=submission["exercise"]
    ids = submission["ids"]
    name = submission["name"]
    owner_firebase_id = submission["owner_firebase_id"]
    currentDT = datetime.datetime.now()
    edit_csv(str(currentDT), solution, ids, "START", name)

    if not os.path.isdir(EXERCISE_DIR + "/" + exercise):
        await tee(websocket, "exercise '{}' not found".format(EXERCISE_DIR + "/" + exercise))
        return

    repository_folder = "/submissions/{}/{}".format(owner_firebase_id, exercise)

    matches = GITLAB_REGEXP.search(solution)

    if matches is None:
        await tee(websocket, "Wrong format of link to github repository!")
        await tee(websocket, "Final Grade: 0")
        return

    if not os.path.isdir(EXERCISE_DIR + "/" + exercise):
        await tee(websocket, "exercise '{}' not found".format(EXERCISE_DIR + "/" + exercise))
        return

    repository_folder = "/submissions/{}/{}".format(owner_firebase_id, exercise)
        
    username = matches.group(1)
    repository = GIT_CLEAN.sub("",matches.group(2))

    # Read the name and ids of the submitters:
    ids = submission["ids"]
    name = submission["name"]

    # Log the start of the submission:
    currentDT = datetime.datetime.now()
    edit_csv(str(currentDT), solution, ids, "START", name)

    current_exercise_folder = os.path.realpath(EXERCISE_DIR + "/" + exercise)

    # If there is a "signature file", then the default is changed to "...(integer)...<signature>..."
    signature_file = current_exercise_folder + "/signature.txt"
    if os.path.isfile(signature_file):
        with open(signature_file) as f:
            grade_signature=f.read().strip()
            grade_regexp = re.compile(".*?(\\d+).*{}.*".format(re.escape(grade_signature)))

    # Read the name and ids of the submitters:
    ids = submission["ids"]
    name = submission["name"]

    # Log the start of the submission:
    currentDT = datetime.datetime.now()
    edit_csv(str(currentDT), solution, ids, "START", name)

    # Set the regular expression for detecting the grade in the file.
    # This is the default regular expression:
    grade_regexp = re.compile("[*].*grade.*:\\s*(\\d+).*[*]", re.IGNORECASE)   # default
    # If there is a "signature file", then the default is changed to "...(integer)...<signature>..."
    signature_file = current_exercise_folder + "/signature.txt"
    if os.path.isfile(signature_file):
        with open(signature_file) as f:
            grade_signature=f.read().strip()
            grade_regexp = re.compile(".*?(\\d+).*{}.*".format(re.escape(grade_signature)))

    # Clone or pull the student's submission from github to the docker container "badkan":
    proc = await docker_command(["exec", "badkan", "bash", "get-private-submission.sh", username, repository, owner_firebase_id, exercise, tokenUsername, tokenPassword])
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        await tee(websocket, line)
    await proc.wait()

    await grade(solution, exercise, ids, name, owner_firebase_id, repository_folder, submission, websocket)


async def check_submission(websocket:object, submission:dict):
    """
    Check a submitted solution to the given exercise from the given git_url.
    :param websocket: for reading the submission params and sending output messages.
    :param submission: a JSON object with at least the following fields:
           "exercise" - name of the exercise; represents a sub-folder of the "exercises" folder.
           "git_url"  - a url for cloning the student's git repository containing the submitted solution.
           must be of the form https://xxx.git.
    """    
    solution=submission["solution"]
    exercise=submission["exercise"]
    ids = submission["ids"]
    name = submission["name"]
    owner_firebase_id = submission["owner_firebase_id"]
    currentDT = datetime.datetime.now()
    edit_csv(str(currentDT), solution, ids, "START", name)

    if not os.path.isdir(EXERCISE_DIR + "/" + exercise):
        await tee(websocket, "exercise '{}' not found".format(EXERCISE_DIR + "/" + exercise))
        return

    repository_folder = "/submissions/{}/{}".format(owner_firebase_id, exercise)

    if "github" in solution:
        await dealing_with_url(solution, websocket, owner_firebase_id, exercise)
    else:
        await dealing_with_file(solution, websocket, owner_firebase_id, exercise)
        print("ZIP")

    await grade(solution, exercise, ids, name, owner_firebase_id, repository_folder, submission, websocket)


async def grade(solution, exercise, ids, name, owner_firebase_id, repository_folder, submission, websocket):

     # Copy the files related to grading from the exercise folder outside docker to the submission folder inside docker:
    current_exercise_dir = os.path.realpath(EXERCISE_DIR + "/" + exercise)
    await tee(websocket, "copying from {}".format(current_exercise_dir))
    print("DEBUD GRADE", current_exercise_dir)
    proc = await docker_command(["cp", current_exercise_dir, "badkan:{}/grading_files".format(repository_folder)])
    async for line in proc.stdout:  print(line)
    await proc.wait()
    # Grade the submission inside the docker container "badkan"
    grade = None
    move_command = "mv grading_files/* . && rm -rf grading_files"
    TIMEOUT_SOFT = 10 # seconds
    TIMEOUT_HARD = 20 # seconds
    grade_command = "timeout -s 9 {} timeout {} nice -n 5 ./grade {} {}".format(TIMEOUT_HARD, TIMEOUT_SOFT, owner_firebase_id, exercise)
    exitcode_command = "echo Exit code: $?"
    combined_command = "{} && {} ; {}".format(move_command, grade_command, exitcode_command)
    proc = await docker_command(["exec", "-w", repository_folder, "badkan", "bash", "-c", combined_command])
    output = ""
    count = 0
    while True:
        try:
            async for line in proc.stdout:  # Loop over all lines created by the "grade" script.
                line = line.decode('utf-8').strip()
                if "output:" in line:
                    output += str(count) + ":;" + line[line.find(":") + 2: len(line)] + ";"
                    count += 1
                else:
                    await tee(websocket, line)
                print("> {}".format(line))  # Print the line to nohup.out, for debugging
                matches = grade_regexp.search(line)
                if matches is not None:     # This line represents the student's grade.
                    await websocket.send("<p style='display:none'>"+line+"</p>\n")
                    if grade is None:       # This is the first time we find such a line.
                        grade = matches.group(1)
                        await tee(websocket, "Signed grade: {}\n".format(grade))
                    else:
                        await tee(websocket, "Signed duplicate grades\n")
                        grade = 0
                else:
                    await websocket.send(line+"\n")   # If the line does not contain a signature - send it to the student
        except ValueError:
            await tee(websocket, "Your program generated a very very long line! Please check it.")
            continue
        else:
            break
    await proc.wait()

    if grade is None:
        grade = 0
    await tee(websocket, "Final Grade: {}".format(grade))
        # This line is read at app/Badkan.js, in websocket.onmessage.

    currentDT = datetime.datetime.now()
    edit_csv(str(currentDT), solution, ids, grade, name)
    # name, last_name, student_id, output, exercice_name
    edit_csv_summary(submission["student_name"], submission["student_last_name"], ids, output, exercise)



async def load_ex(url, folder_name, username, password, exercise):
    """
    :param url: the url of the submission.
    :param folder_name: the folder_name of the solved exercise 
    (it's composed of the uid of the owner + "_" + nb of exercise he created).
    :param username: the username of the deploy token to clone the private repo.
    :param password: the password of the deploy token to clone the private repo.
    :param exercise: the name of the solved exercise.
    """
    git_clone("../exercises", url, folder_name, username, password, exercise)
    print("your exercise is loaded.")


async def edit_ex(folder_name, ex_folder):
    """
    :param folder_name: the folder_name of the solved exercise 
    (it's composed of the uid of the owner + "_" + nb of exercise he created).
    :param exercise: the name of the folder of the solved exercise.
    """
    git_pull("../exercises", folder_name, ex_folder)
    print("your exercise is edited.")

async def delete_ex(delete_ex):
    """
    :param delete_ex: the name of the folder of the exercise to delete.
    """
    rmv("../exercises", delete_ex)
    print("your exercise is deleted.")

async def moss_command(websocket, submission):
    compiler=submission["compiler"]
    exercise_id=submission["exercise_id"]
    info=submission["info"]
    informations = info.replace("-", " ")
    shellscript = subprocess.Popen(['bash','../moss/exec-moss.sh', compiler, exercise_id, informations], stdout=subprocess.PIPE)
    shellscript.wait()
    for line in shellscript.communicate():
        if line is not None:
            print("DEBUG", line.decode("utf-8") )
            print("DEBUG TYPE", type(line))
            await tee(websocket, line.decode("utf-8") )


async def run(websocket, path):
    """
    Run a websocket server that receives submissions and grades them.
    """
    submission_json = await websocket.recv()   # returns a string
    print("< {} ".format(submission_json))
    submission = json.loads(submission_json)   # converts the string to a python dict

    target = submission["target"]  # The target fields is mandatory for all websocket protocol we use.

    if target == 'load_ex':
        await load_ex(submission["git_url"], submission["folderName"], submission["username"], submission["pass"], submission["exFolder"])
    elif target == 'edit_ex':
        await edit_ex(submission["folderName"], submission["exFolder"])
    elif target == 'delete_ex':
        await delete_ex(submission["delete_exercise"])
    elif target == 'run_admin':
        await run_for_admin(submission["owner_firebase_id"], submission["exercise_id"], websocket)
    elif target == 'run_all':
        await run_all_submissions(submission["exercise_id"], submission["users_map"], websocket)
    elif target == 'check_private_submission':
        await check_private_submission(websocket, submission)
    elif target == 'moss_command':
        await moss_command(websocket, submission)
    else:
        await check_submission(websocket, submission)
    print ("> Closing connection")


websocketserver = websockets.server.serve(run, '0.0.0.0', PORT_NUMBER, origins=None)
print("{} listening at {}".format(type(websocketserver), PORT_NUMBER))

loop = asyncio.get_event_loop()
loop.run_until_complete(websocketserver)
loop.run_forever()
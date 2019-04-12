#!/usr/bin/env python3

"""
A server for submission and checking of exercises.
AUTHOR: Erel Segal-Halevi
SINCE: 2019-03
"""


import websockets, asyncio, os, json, re, sys, datetime

from terminal import *
from csv_trace import edit_csv

PORT = sys.argv[1] if len(sys.argv)>=2 else 5670   # same port as in frontend/index.html

EXERCISE_DIR = os.path.realpath(os.path.dirname(os.path.abspath(__file__))+"/../exercises")


# Example https: https://github.com/SamuelBismuth/badkan.git
# Example ssh: git@github.com:SamuelBismuth/badkan.git
GIT_REGEXP = re.compile(".*github[.]com.(.*)/(.*)", re.IGNORECASE)
GIT_CLEAN  = re.compile(".git.*", re.IGNORECASE)

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


async def check_submission(websocket:object, submission:dict):
    """
    Check a submitted solution to the given exercise from the given git_url.
    :param websocket: for reading the submission params and sending output messages.
    :param submission: a JSON object with at least the following fields:
           "exercise" - name of the exercise; represents a sub-folder of the "exercises" folder.
           "git_url"  - a url for cloning the student's git repository containing the submitted solution.
           must be of the form https://xxx.git.
    """
    # Read the exercise name and verify that it exists:
    exercise=submission["exercise"]
    current_exercise_folder = os.path.realpath(EXERCISE_DIR + "/" + exercise)
    if not os.path.isdir(current_exercise_folder):
        await tee(websocket, "exercise '{}' not found".format(current_exercise_folder))
        return

    # Read the git url and verify its format:
    git_url =submission["git_url"]
    matches = GIT_REGEXP.search(git_url)
    if matches is None:
        await tee(websocket, "Wrong format of link to github repository!")
        await tee(websocket, "Final Grade: 0")
        return
    username = matches.group(1)
    repository = GIT_CLEAN.sub("",matches.group(2))
    repository_folder = "/submissions/{}/{}".format(username,repository)

    # Read the name and ids of the submitters:
    ids = submission["ids"]
    name = submission["name"]

    # Log the start of the submission:
    currentDT = datetime.datetime.now()
    edit_csv(str(currentDT), git_url, ids, "START", name)

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
    proc = await docker_command(["exec", "badkan", "bash", "get-submission.sh", username, repository])
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        await tee(websocket, line)
    await proc.wait()

    # Copy the files related to grading from the exercise folder outside docker to the submission folder inside docker:
    await tee(websocket, "copying from {}/. to badkan:{}/".format(current_exercise_folder,repository_folder))
    proc = await docker_command(["cp", current_exercise_folder+"/.", "badkan:{}/".format(repository_folder)])
    async for line in proc.stdout:  print(line)
    await proc.wait()

    # Grade the submission inside the docker container "badkan"
    TIMEOUT_SOFT = 10 # seconds
    TIMEOUT_HARD = 20 # seconds
    grade_command = "timeout -s 9 {} timeout {} nice -n 5 ./grade {} {}".format(TIMEOUT_HARD, TIMEOUT_SOFT, username,repository)
    exitcode_command = "echo Exit code: $?"
    combined_command = "{} ; {}".format(grade_command, exitcode_command)
    proc = await docker_command(["exec", "-w", repository_folder, "badkan", "bash", "-c", combined_command])
    grade = None
    while True:
        try:
            async for line in proc.stdout:  # Loop over all lines created by the "grade" script.
                line = line.decode('utf-8').strip()
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
    edit_csv(str(currentDT), git_url, ids, grade, name)


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


async def run(websocket, path):
    """
    Run a websocket server that receives submissions and grades them.
    """
    submission_json = await websocket.recv()   # returns a string
    print("< {} ".format(submission_json))
    submission = json.loads(submission_json)   # converts the string to a python dict
    if submission_json[2] == 'g':
        await load_ex(submission["git_url"], submission["folderName"], submission["username"], submission["pass"], submission["exFolder"])
    elif submission_json[3] == 'o':
        await edit_ex(submission["folderName"], submission["exFolder"])
    elif submission_json[2] == 'd':
        await delete_ex(submission["delete_exercise"])
    else:
        await check_submission(websocket, submission)
    print ("> Closing connection")


websocketserver = websockets.server.serve(run, '0.0.0.0', PORT, origins=None)
print("{} listening at {}".format(type(websocketserver), PORT))

loop = asyncio.get_event_loop()
loop.run_until_complete(websocketserver)
loop.run_forever()

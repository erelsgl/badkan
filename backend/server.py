
#!/usr/bin/env python3

"""
A server for submission and checking of exercises.

AUTHOR: Erel Segal-Halevi
SINCE: 2018-01
"""
import websockets, subprocess, asyncio, os, urllib,  json, re
import csv
import sys

PORT = sys.argv[1] if len(sys.argv)>=2 else 5678   # same port as in frontend/index.html
EXERCISE_DIR = "../exercises"

GIT_REGEXP = re.compile("http.*github[.]com/(.*)/(.*)", re.IGNORECASE)
GIT_CLEAN  = re.compile(".git.*", re.IGNORECASE)

async def tee(websocket, message):
    """
    Send a message both to the backend screen and to the frontend client.
    """
    print("> " + message)
    await websocket.send(message)

async def check_submission(websocket:object, exercise:str, git_url:str , submission):
    """
    Check a submitted solution to the given exercise from the given git_url.
    :param websocket: for reading the submission params and sending output messages.
    :param exercise:  name of the exercise; represents a sub-folder of the "exercises" folder.
    :param git_url:   a url for cloning the student's git repository containing the submitted solution.
                      must be of the form https://xxx.git.
    """
    if not os.path.isdir(EXERCISE_DIR+"/"+exercise):
        await tee(websocket, "exercise '{}' not found".format(exercise))
        return

    # to find student grade 
    gradeLinePrefix = "your grade is :"
    grade = "putGradeHere"

    # Copy the files related to grading from the exercise folder to the docker container.
    with subprocess.Popen(["docker", "cp", EXERCISE_DIR+"/"+exercise, "badkan:/"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True) as proc:
        for line in proc.stdout:
            if(gradeLinePrefix in line):
                grade = line[len(gradeLinePrefix):]
            print(line)
        for line in proc.stderr:
            print(line)
    matches = GIT_REGEXP.search(git_url)
    username = matches.group(1)
    repository = GIT_CLEAN.sub("",matches.group(2))

    # Grade the submission inside the docker container named "badkan"
    with subprocess.Popen(["docker", "exec", "badkan",
        "nice",  "-n", "5",
        "bash", "grade-single-submission.sh", exercise, username, repository], stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True) as proc:
        for line in proc.stdout:
            if(gradeLinePrefix in line):
                grade = line[len(gradeLinePrefix):]
            await tee(websocket, line.strip())

        for line in proc.stderr:
            await tee(websocket, line.strip())

    await appendGradeTofile(grade,submission)

async def appendGradeTofile(grade,submission):
    '''
    append submission grade to csv file 
    :param grade: string representing student grade
    :param submission: dict with keys ID_1 , ID_2, ID_3, student_names, exercise  where ID is student ID 
    '''
    if (any(arg not in submission for arg in ("ID_1" , "ID_2" , "ID_3" , "student_names" , "exercise" ))):
        print("this is an anonymous submission")
        return
    print("this is NOT an anonymous submission")
    file = open('grades'+ submission["exercise"] +'.csv', 'a+')
    gradesCsv = csv.writer(file)
    gradesCsv.writerow([submission["ID_1"],submission["ID_2"],submission["ID_3"],submission["student_names"],grade])
    file.close()

async def run(websocket, path):
    """
    Run a websocket server that receives submissions and grades them.
    """
    submission_json = await websocket.recv()
    print("< "+submission_json)
    submission = json.loads(submission_json)
    await check_submission(websocket, submission["exercise"], submission["git_url"],submission)
    print ("> Closing connection")

websocketserver = websockets.server.serve(run, '0.0.0.0', PORT, origins=None)
print("{} listening at {}".format(type(websocketserver), PORT))

asyncio.get_event_loop().run_until_complete(websocketserver)
asyncio.get_event_loop().run_forever()

#!/usr/bin/env python3

"""
A server for submission and checking of exercises.

AUTHOR: Erel Segal-Halevi
SINCE: 2018-01
"""
import websockets, subprocess, asyncio, os, urllib,  json, re
import csv, time
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


def docker_command(command_words):
    """
    :param command_words: a list of words to be executed by docker.
    :return: a stream that contains all output of the command (stdout and stderr together)
    """
    return subprocess.Popen(
        ["docker"] + command_words,
        stdout=subprocess.PIPE, stderr=subprocess.STDOUT, universal_newlines=True)


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

    matches = GIT_REGEXP.search(git_url)
    username = matches.group(1)
    repository = GIT_CLEAN.sub("",matches.group(2))
    repository_folder = "/submissions/"+username+"/"+repository

    # Clone or pull the student's submission from github to the docker container "badkan":
    with docker_command(["exec", "badkan", "source", "get-submission.sh", username, repository]) as proc:
        for line in proc.stdout:
            await tee(websocket, line.strip())


    # Copy the files related to grading from the exercise folder outside docker to the submission folder inside docker:
    with docker_command(["cp", EXERCISE_DIR + "/" + exercise, "badkan:"+repository_folder]) as proc:
        for line in proc.stdout:  print(line)

    # Grade the submission inside the docker container "badkan"
    with docker_command(["exec", "badkan", "cd " + repository_folder + "; nice -n 5 ./grade"]) as proc:
        for line in proc.stdout:
            if(gradeLinePrefix in line):
                grade = line[len(gradeLinePrefix):]
            await tee(websocket, line.strip())
    await appendGradeTofile(grade,submission,git_url)

async def appendGradeTofile(grade,submission,git_url):
    '''
    append submission grade to csv file 
    :param grade: string representing student grade
    :param submission: dict with keys ID_1 , ID_2, ID_3, student_names, exercise  where ID is student ID 
    '''
    if (any(arg not in submission for arg in ("ID_1" , "ID_2" , "ID_3" , "student_names" , "exercise" ))):
        print("this is an anonymous submission")
        return
    print("this is NOT an anonymous submission")
    timestamp = time.asctime(time.localtime())
    file = open('grades'+ submission["exercise"] +'.csv', 'a+')
    gradesCsv = csv.writer(file)
    gradesCsv.writerow([submission["ID_1"],submission["ID_2"],submission["ID_3"],submission["student_names"],git_url,grade.rstrip(),timestamp])
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

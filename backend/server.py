#!/usr/bin/env python3

"""
A server for submission and checking of exercises.

AUTHOR: Erel Segal-Halevi
SINCE: 2018-01
"""
import websockets, subprocess, asyncio, os, urllib,  json

PORT = 5678   # same port as in frontend/index.html
EXERCISE_DIR = "../exercises"

async def tee(websocket, message):
    """
    Send a message both to the backend screen and to the frontend client.
    """
    print("> " + message)
    await websocket.send(message)

async def check_submission(websocket:object, exercise:str, git_url:str):
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

    # Copy the files related to gradine from the exercise folder to the docker container.
    with subprocess.Popen(["docker", "cp", EXERCISE_DIR+"/"+exercise, "badkan:/"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True) as proc:
        for line in proc.stdout:
            print(line)
        for line in proc.stderr:
            print(line)

    path = urllib.parse.urlparse(git_url).path[1:-4]  # skip initial "/" and final ".git"
    (username,repository) = os.path.split(path)
    #await tee(websocket, "Cloning {} into {}/{}".format(git_url, username, repository))

    # Grade the submission inside the docker container named "badkan"
    with subprocess.Popen(["docker", "exec", "badkan",
        "bash", "grade-single-submission.sh", exercise, username, repository], stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True) as proc:
        for line in proc.stdout:
            await tee(websocket, line.strip())
        for line in proc.stderr:
            await tee(websocket, line.strip())

async def run(websocket, path):
    """
    Run a websocket server that receives submissions and grades them.
    """
    submission_json = await websocket.recv()
    print("< "+submission_json)
    submission = json.loads(submission_json)
    await check_submission(websocket, submission["exercise"], submission["git_url"])
    print ("> Closing connection")


websocketserver = websockets.server.serve(run, '0.0.0.0', PORT, origins=None)
print("{} listening at {}".format(type(websocketserver), PORT))

asyncio.get_event_loop().run_until_complete(websocketserver)
asyncio.get_event_loop().run_forever()

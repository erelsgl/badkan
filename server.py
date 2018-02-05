#!/usr/bin/env python3

"""
A server for submission and checking of homework.

AUTHOR: Erel Segal-Halevi
SINCE: 2018-01
"""
import websockets, subprocess, asyncio, os, urllib,  json


PORT = 5678

async def tee(websocket, message):
    print("> " + message)
    await websocket.send(message)


async def check_submission(websocket, homework_name, git_url):
    if not os.path.isdir(homework_name):
        await tee(websocket, "homework '{}' not found".format(homework_name))
        return

    # Copy the files related to gradine from the homework folder to the docker container.
    with subprocess.Popen(["docker", "cp", homework_name, "cpp-course:/"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True) as proc:
        for line in proc.stdout:
            print(line)
        for line in proc.stderr:
            print(line)

    path = urllib.parse.urlparse(git_url).path[1:-4]  # skip initial "/" and final ".git"
    (username,repository) = os.path.split(path)
    #await tee(websocket, "Cloning {} into {}/{}".format(git_url, username, repository))

    # Grade the submission inside the docker container named "cpp-course"
    with subprocess.Popen(["docker", "exec", "cpp-course",
        "bash", "grade-single-submission.sh", homework_name, username, repository], stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True) as proc:
        for line in proc.stdout:
            await tee(websocket, line.strip())
        for line in proc.stderr:
            await tee(websocket, line.strip())

async def run(websocket, path):
    submission_json = await websocket.recv()
    print("< "+submission_json)
    submission = json.loads(submission_json)
    await check_submission(websocket, submission["homework_name"], submission["git_url"])
    print ("> Closing connection")


websocketserver = websockets.server.serve(run, '127.0.0.1', PORT, origins=None)
print("{} listening at {}".format(type(websocketserver), PORT))

asyncio.get_event_loop().run_until_complete(websocketserver)
asyncio.get_event_loop().run_forever()

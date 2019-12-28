"""
A server for submission and checking of exercises.
AUTHOR:  Shmouel Yossef Haim Avraham ben Shlomo, Erel Segal-Halevi
SINCE: 2019-03
"""

from imports_servers import *

# same port as in frontend/index.html
PORT_NUMBER = int(sys.argv[1]) if len(sys.argv) >= 2 else 5670


async def run(websocket, path):
    """
    Run a websocket server that receives submissions and grades them.
    """
    submission_json = await websocket.recv()   # returns a string
    print("< {} ".format(submission_json))
    # converts the string to a python dict
    submission = json.loads(submission_json)
    # The target fields is mandatory for all websocket protocol we use.
    target = submission["target"]
    if target == 'check_submission':
        await check_submission(websocket, submission)
    if target == 'run_submission_admin':
        await run_submission_admin(websocket, submission)
    if target == "run_submissions_admin":
        await run_submissions_admin(websocket, submission["exercise_id"])
    print("> Closing connection")


websocketserver = websockets.server.serve(
    run, '0.0.0.0', PORT_NUMBER, origins=None)
print("{} listening at {}".format(type(websocketserver), PORT_NUMBER))
loop = asyncio.get_event_loop()
loop.run_until_complete(websocketserver)
loop.run_forever()

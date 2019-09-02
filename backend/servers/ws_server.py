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
#     print("< {} ".format(submission_json))
#     # converts the string to a python dict
#     submission = json.loads(submission_json)
#     # The target fields is mandatory for all websocket protocol we use.
#     target = submission["target"]
#     redirect = None
#     if "redirect" in submission and submission["redirect"] != "None":
#         redirect = submission["redirect"]
#     if target == 'check_url_submission':
#         await check_submission(websocket, submission, dealing_with_url)
#     elif target == 'check_file_submission':
#         await check_submission(websocket, submission, dealing_with_file)
#     elif target == 'check_private_submission':
#         await check_private_submission(websocket, submission)
#     elif target == 'load_ex':
#         await load_ex(submission["git_url"], submission["folderName"], submission["username"], submission["pass"], submission["exFolder"])
#     elif target == 'edit_ex':
#         await edit_ex(submission["folderName"], submission["exFolder"])
#     elif target == 'delete_ex':
#         await delete_ex(submission["delete_exercise"])
#     elif target == 'run_admin':
#         await run_for_admin(submission["owner_firebase_id"], submission["exercise_id"], websocket)
#     elif target == 'run_all':
#         await run_all_submissions(submission["exercise_id"], submission["users_map"], websocket)
#     elif target == 'moss_command':
#         await moss_command(websocket, submission)
#     elif target == "check_test_peer_submission":
#         await check_test_peer_submission(websocket, submission)
#     elif target == "check_solution_peer_submission":
#         await check_solution_peer_submission(websocket, submission)
#     elif target == "create_course":
#         pass
#     elif target == "edit_course":
#         pass
#     elif target == "delete_course":
#         pass
#     else:
#         print("Illegal target {}".format(target))
#     if redirect:
#         await tee(websocket, "@$@redirect@$@" + redirect)
#     print("> Closing connection")


websocketserver = websockets.server.serve(
    run, '0.0.0.0', PORT_NUMBER, origins=None)
print("{} listening at {}".format(type(websocketserver), PORT_NUMBER))
loop = asyncio.get_event_loop()
loop.run_until_complete(websocketserver)
loop.run_forever()

from imports_input_output import *
from submission_handler import *

async def run_submission_admin(websocket, submission):
    exercise = get_exercise_by_id(submission["exercise_id"])
    firebase_path = "submissions/" + \
        submission["exercise_id"]+"/"+submission["uid"]
    zip_file = "../" + firebase_path + ".zip"
    await save_firebase_submission(submission, firebase_path, zip_file)
    await upload_submission_to_docker_and_firebase(submission, zip_file)
    await run_submission(websocket, exercise, submission["uid"])
    return 'OK'


async def save_firebase_submission(submission, firebase_path, zip_file):
    create_folder_if_not_exists(
        submission["exercise_id"], submission["uid"])
    download_and_save_submission(firebase_path, zip_file)

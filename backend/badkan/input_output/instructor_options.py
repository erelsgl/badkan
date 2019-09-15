from imports_input_output import *
from submission_handler import *


async def run_submission_admin(websocket, submission):
    exercise = get_exercise_by_id(submission["exercise_id"])
    firebase_path = "submissions/" + \
        submission["exercise_id"]+"/"+submission["uid"]
    zip_file = "../" + firebase_path + ".zip"
    await save_firebase_submission(submission, firebase_path, zip_file)
    await upload_submission_to_docker(submission["uid"], zip_file)
    await run_submission(websocket, exercise, submission["uid"])
    return 'OK'


async def save_firebase_submission(submission, firebase_path, zip_file):
    create_folder_if_not_exists(
        submission["exercise_id"], submission["uid"])
    download_and_save_submission(firebase_path, zip_file)


async def run_submissions_admin(websocket, exercise_id):
    await download_submissions_zip(exercise_id)
    exercise = get_exercise_by_id(exercise_id)
    # TODO: Worried about directory not empty:
    # Error message: mv: cannot move './-Lo0hixQdaOVcA1SA5GT' to
    # '../submissions/-Lo0hixQdaOVcA1SA5GT': Directory not empty
    await terminal_command_log(["mv", "./"+exercise_id, "../submissions/"])
    submission_list = os.listdir("../submissions/"+exercise_id)
    for uid in submission_list:
        introducing = "Submission of the student " + \
            get_country_id_by_uid(uid) + ":"
        await tee(websocket, introducing)
        zip_file = "../submissions/" + exercise_id + "/" + uid
        await upload_submission_to_docker(uid, zip_file)
        await run_submission(websocket, exercise, uid)
        await tee(websocket, "#################")
    return 'OK'


async def check_plagiat(exercise_id, language):
    submission_path = "../"+exercise_id+"/*/*/*"
    line = await terminal_command_return(["bash", "moss/moss_command.sh", language, submission_path])
    return line[line.find("http"):]

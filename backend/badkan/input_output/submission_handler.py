from imports_input_output import *


# Example https: https://github.com/SamuelBismuth/badkan.git
# Example ssh: git@github.com:SamuelBismuth/badkan.git
GIT_REGEXP = re.compile(".*github[.]com.(.*)/(.*)", re.IGNORECASE)
GIT_CLEAN = re.compile(".git.*", re.IGNORECASE)


async def check_submission(websocket, submission):
    currentDT = datetime.now()
    exercise = get_exercise_by_id(submission["exercise_id"])
    submitters = [submission["country_id"],
                  submission["collab1"], submission["collab2"]]
    zip_filename = "../submissions/" + \
        submission["exercise_id"]+"/"+submission["uid"]+".zip"
    if "github_url" in submission:
        edit_csv_trace(str(
            currentDT), submission["github_url"], submitters, "START", exercise["exercise_name"], zip_filename)
        await save_github_submission(submission, zip_filename)
        await upload_submission_to_docker_and_firebase(submission, zip_filename)
    else:
        edit_csv_trace(str(currentDT), "zip", submitters,
                       "START", exercise["exercise_name"], zip_filename)
        await upload_submission_to_docker_and_firebase(submission, zip_filename)
    return 'OK'


def save_zip_submission(zip_file, exercise_id, uid):
    create_folder_if_not_exists(exercise_id, uid)
    zip_file.save("../submissions/" +
                  exercise_id + "/" + uid + ".zip")


async def save_github_submission(submission, zip_filename):
    create_folder_if_not_exists(submission["exercise_id"], submission["uid"])
    # TODO: check for typo with regex.
    wget_url = submission["github_url"]+"/archive/master.zip"
    await terminal_command_log(["wget", wget_url, "-O", zip_filename])


def create_folder_if_not_exists(exercise_id, uid):
    try:
        os.mkdir("../submissions/" + exercise_id)
    except FileExistsError:
        print("Directory already exists")


async def upload_submission_to_docker_and_firebase(submission, zip_filename):
    upload_zip_solution(
        zip_filename, submission["exercise_id"], submission["uid"])
    await docker_command_log(["exec", "badkan", "mkdir", "grading_room/"+submission["uid"]])
    await docker_command_log(["cp", zip_filename, "badkan:/grading_room/"+submission["uid"]])
    await terminal_command_log(["rm", zip_filename])

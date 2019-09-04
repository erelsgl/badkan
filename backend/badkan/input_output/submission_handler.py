from imports_input_output import *


# Example https: https://github.com/SamuelBismuth/badkan.git
# Example ssh: git@github.com:SamuelBismuth/badkan.git
GIT_REGEXP = re.compile(".*github[.]com.(.*)/(.*)", re.IGNORECASE)
GIT_CLEAN = re.compile(".git.*", re.IGNORECASE)


async def check_submission(websocket, submission):
    currentDT = datetime.now()
    exercise = get_exercise_by_id(submission["exercise_id"])
    if "github_url" in submission:
        edit_csv_trace(str(
            currentDT), submission["github_url"], "ids", "START", exercise["exercise_name"])
        await check_submission_github(submission)
    else:
        edit_csv_trace(str(currentDT), "zip", "ids",
                       "START", exercise["exercise_name"])
        await check_submission_zip(submission)
    return 'OK'


def store_zip_solution(zip_file, exercise_id, uid):
    try:
        os.mkdir("../submissions/" + exercise_id)
    except FileExistsError:
        print("Directory already exists")
    zip_file.save("../submissions/" +
                  exercise_id + "/" + uid + ".zip")


async def check_submission_github(submission):
    pass


async def check_submission_zip(submission):
    await docker_command_log(["cp", "../submissions/" +
                              submission["exercise_id"] + "/" + submission["uid"] + ".zip", "badkan:/"])

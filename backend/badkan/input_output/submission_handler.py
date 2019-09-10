from imports_input_output import *

# TODO: Checked about Erel works: long line, signature, valgrind...
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
        matches = GIT_REGEXP.search(submission["github_url"])
        username = matches.group(1)
        repository = GIT_CLEAN.sub("", matches.group(2))
        wget_url = "https://github.com/"+username+"/"+repository+"/archive/master.zip"
        edit_csv_trace(str(
            currentDT), submission["github_url"], submitters, "START", exercise["exercise_name"], zip_filename)
        await save_github_submission(submission, zip_filename, wget_url)
        await upload_submission_to_docker_and_firebase(submission, zip_filename)
    else:
        edit_csv_trace(str(currentDT), "zip", submitters,
                       "START", exercise["exercise_name"], zip_filename)
        await upload_submission_to_docker_and_firebase(submission, zip_filename)
    grade = await run_submission(websocket, exercise, submission["uid"])
    if "save_grade" in submission:
        await save_grade(submission, websocket, grade, str(currentDT))
    else:
        await tee(websocket, "This submission is meaningless, any grade has been stored. <br> < If you want the grade to be stored, please check the \"Save the grade\" button.")
    return 'OK'


async def save_grade(submission, websocket, grade, timestamp):
    url = "zip"
    if "github_url" in submission:
        url = submission["github_url"]
    create_or_update_submission(grade, submission["exercise_id"], submission["uid"], submission["country_id"],
                                submission["collab1"], submission["collab2"], url, timestamp)
    # TODO: (eventually put the name of the collab if exists.
    await tee(websocket, "Your grade is successfully stored.")


def save_zip_submission(zip_file, exercise_id, uid):
    create_folder_if_not_exists(exercise_id, uid)
    zip_file.save("../submissions/" +
                  exercise_id + "/" + uid + ".zip")


async def save_github_submission(submission, zip_filename, wget_url):
    create_folder_if_not_exists(submission["exercise_id"], submission["uid"])
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


async def run_submission(websocket, exercise, uid):
    return await docker_command_tee_with_grade(["exec", "badkan", "bash", "grade.sh",
                                                exercise["exercise_name"],  exercise["exercise_compiler"], dict_to_string(
                                                    exercise["input_output_points"]),
                                                exercise["main_file"], exercise["input_file_name"], exercise["output_file_name"], uid,
                                                get_running_command(exercise["exercise_compiler"], exercise["main_file"])], websocket)


def dict_to_string(my_dicts):
    answer = ''
    for my_dict in my_dicts:
        for item in my_dict.values():
            answer += item + '@*@'
        answer += ' '
    return answer


def get_running_command(compiler, main_file):
    if compiler == "javac":
        return "java " + main_file[:main_file.find('.')]
    elif compiler == "g++":
        return "./a.out"
    elif compiler == "python3":
        return "python3 " + main_file
    else:
        return "unknown compiler."

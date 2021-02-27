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
    if not await collaborator_not_exist(submission["collab1"], submission["collab2"], websocket):
        return
    if "github_url" in submission:
        matches = GIT_REGEXP.search(submission["github_url"])
        username = matches.group(1)
        repository = GIT_CLEAN.sub("", matches.group(2))
        git_clone_url = "https://github.com/"+username+"/"+repository+".git"
        edit_csv_trace(str(
            currentDT), submission["github_url"], submitters, "START", exercise["exercise_name"], zip_filename)
        if not await save_github_submission(submission, zip_filename, git_clone_url, submission["uid"], websocket):
            await tee(websocket, "A problem with the GitHub URL occured.")
            await tee(websocket, "Please, check that your repository exists.")
            await tee(websocket, "If your repository is private, make sure you provided your personal GitHub token.")
            await tee(websocket, "To do so, go to settings and click on the button 'Add GitHub token'")
            return
    else:
        edit_csv_trace(str(currentDT), "zip", submitters,
                       "START", exercise["exercise_name"], zip_filename)
    if not await check_submission_size(zip_filename):
        await tee(websocket, "Your submission takes too much place. Please submit a smaller file (less than 4MB).")
        return
    await upload_submission_to_docker_and_firebase(submission["exercise_id"], submission["uid"], zip_filename)
    output = []
    if "github_url" in submission:
        grade = await run_submission(websocket, exercise, submission["uid"], submission["exercise_id"], True, output)
    else:
        grade = await run_submission(websocket, exercise, submission["uid"], submission["exercise_id"], False, output)
    if "save_grade" in submission:
        await save_grade(submission, websocket, grade, str(currentDT))
        x = threading.Thread(target=edit_statistics, args=(
            output, submission["country_id"], submission["exercise_id"],))
        x.start()
    else:
        await tee(websocket, "Your grade has not been stored. To store your grade, please check the \"Save the grade\" button")
    edit_csv_trace(str(currentDT), grade, submitters,
                   "FINISH", exercise["exercise_name"], zip_filename)
    return 'OK'


async def check_submission_size(zip_filename):
    statinfo = os.stat(zip_filename)
    print("SIZE : ", statinfo)
    if statinfo.st_size > 4194304:
        await terminal_command_log(["rm", zip_filename])
        return False
    return True


async def save_grade(submission, websocket, grade, timestamp):
    url = "zip"
    if "github_url" in submission:
        url = submission["github_url"]
    create_or_update_submission(grade, submission["exercise_id"], submission["uid"], submission["country_id"],
                                submission["collab1"], submission["collab2"], url, timestamp)
    await tee(websocket, "Your grade is successfully stored.")


def save_zip_submission(zip_file, exercise_id, uid):
    create_folder_if_not_exists(exercise_id)
    zip_file.save("../submissions/" +
                  exercise_id + "/" + uid + ".zip")


def save_zip_exercise(zip_file, exercise_id):
    create_folder_custom_if_not_exists(exercise_id)
    zip_file.save("../custom_by_zip_exercise/" +
                  exercise_id + ".zip")


async def collaborator_not_exist(collab1, collab2, websocket):
    answer = True
    if collab1 != '' and get_uid_by_country_id(collab1) == None:
        await print_not_exist_message('first', collab1, websocket)
        answer = False
    if collab2 != '' and get_uid_by_country_id(collab2) == None:
        await print_not_exist_message('second', collab2, websocket)
        answer = False
    return answer


async def print_not_exist_message(collborator_number, collaborator_false_id, websocket):
    await tee(websocket, 'The ' + collborator_number + ' collaborator id (' + collaborator_false_id + ') is not exist.')
    await tee(websocket, "Please, check if your collaborator have a badkan account, and that the ids match.")
    return False


async def save_github_submission(submission, zip_filename, git_clone_url, uid, websocket):
    path = "../submissions/" + submission["exercise_id"]
    create_folder_if_not_exists(submission["exercise_id"])
    result = await terminal_command_return(["git", "clone", git_clone_url, path + "/" + submission["uid"]])
    git_log = ""
    await terminal_command_tee(["bash", "zip.sh", path, submission["uid"], git_log], websocket)
    await terminal_command_log(["rm", "-R", path + "/" + submission["uid"]])
    return True


async def save_github_private_submission(zip_filename, curl_url, uid):
    token = check_and_retreive_github_token(uid)
    print(token)
    if token is not None:
        authorization = "Authorization: token " + token
        result = await terminal_command_return(["curl", "-L", "-o", zip_filename, "-H", authorization, "-w '%{http_code}'", curl_url])
        if "404" in result:
            return False
        else:
            return True
    else:
        return False


def create_folder_if_not_exists(exercise_id):
    try:
        os.mkdir("../submissions/" + exercise_id)
    except FileExistsError:
        print("Directory already exists")

def create_folder_custom_if_not_exists(exercise_id):
    try:
        os.mkdir("../custom_by_zip_exercise")
    except FileExistsError:
        print("Directory already exists")


async def upload_submission_to_docker_and_firebase(exercise_id, uid, zip_filename):
    upload_zip_solution(
        zip_filename, exercise_id, uid)
    await upload_submission_to_docker(uid, zip_filename)


async def upload_submission_to_docker(uid, zip_filename):
    await docker_command_log(["exec", "badkan", "mkdir", "grading_room/"+uid])
    await docker_command_log(["exec", "badkan", "mkdir", "grading_room/"+uid+"/"+uid])
    await docker_command_log(["cp", zip_filename, "badkan:/grading_room/"+uid+"/"+uid])
    await terminal_command_log(["rm", zip_filename])

async def upload_exercise_by_zip_to_docker(exercise_id, zip_name, uid):
    await docker_command_log(["exec", "badkan", "mkdir", "grading_room/"+uid+"/"+exercise_id])
    await docker_command_log(["cp", zip_name, "badkan:/grading_room/"+uid+"/"+ exercise_id])
    # await terminal_command_log(["rm", zip_name])


async def run_submission(websocket, exercise, folder_name, exerciseId, github_submission, output=None):
    # check if the submission is normal or custom.
    # easy checking using the fields of the exercise?
    # if normal:
    if "input_file_name" in exercise:
        signature = random_string()
        return await docker_command_tee_with_grade(["exec", "badkan", "bash", "grade.sh",
                                                    exercise["exercise_name"],  exercise["exercise_compiler"], dict_to_string(
                                                        exercise["input_output_points"]),
                                                    exercise["main_file"], exercise["input_file_name"], exercise["output_file_name"], folder_name,
                                                    get_running_command(
                                                        exercise["exercise_compiler"], exercise["main_file"]), signature], websocket,
                                                   exercise["show_input"], exercise["show_output"], signature, output)
    else:
        if 'url_exercise' in exercise and exercise["url_exercise"]!='false' and exercise["url_exercise"]:
            return await docker_command_custom_exercise(folder_name, exercise["url_exercise"], websocket, False, github_submission)
        elif 'zip_exercise' in exercise and exercise["zip_exercise"]:
            zip_name = "../custom_by_zip_exercise/" + exerciseId +".zip"
            await upload_exercise_by_zip_to_docker(exerciseId, zip_name, folder_name)
            return await docker_command_custom_exercise(folder_name, exerciseId, websocket, True, github_submission)
        else:
            return


def random_string(stringLength=20):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(stringLength))


def dict_to_string(my_dicts):
    answer = ''
    for my_dict in my_dicts:
        for item in my_dict.values():
            item = item.replace("\n", "^,^").strip()
            item = item.replace(" ", "&-&").strip()
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
    elif compiler == "perl":
        return "perl " + main_file
    else:
        return "unknown compiler."

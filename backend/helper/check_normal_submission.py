
from imports_helper import *

# Example https: https://github.com/SamuelBismuth/badkan.git
# Example ssh: git@github.com:SamuelBismuth/badkan.git
GIT_REGEXP = re.compile(".*github[.]com.(.*)/(.*)", re.IGNORECASE)
GITLAB_REGEXP = re.compile(".*gitlab[.]com.(.*)/(.*)", re.IGNORECASE)
GIT_CLEAN = re.compile(".git.*", re.IGNORECASE)


async def check_submission(websocket: object, submission: dict, dealing_with):
    """
    Check a submitted solution to the given exercise from the given git_url.
    :param websocket: for reading the submission params and sending output messages.
    :param submission: a JSON object with at least the following fields:
           "exercise" - name of the exercise; represents a sub-folder of the "exercises" folder.
           "git_url"  - a url for cloning the student's git repository containing the submitted solution.
           must be of the form https://xxx.git.
    :dealing_with: the function to handle submission via file or url.
    """
    solution = submission["solution"]
    exercise = submission["exercise"]
    ids = submission["ids"]
    name = submission["name"]
    owner_firebase_id = submission["owner_firebase_id"]
    currentDT = datetime.datetime.now()
    edit_csv_trace(str(currentDT), solution, ids, "START", name)
    if not os.path.isdir(EXERCISE_DIR + "/" + exercise):
        await tee(websocket, "exercise '{}' not found".format(EXERCISE_DIR + "/" + exercise))
        return
    repository_folder = "/submissions/{}/{}".format(
        owner_firebase_id, exercise)
    await dealing_with(solution, websocket, owner_firebase_id, exercise)
    await grade(solution, exercise, ids, name, owner_firebase_id, repository_folder, submission, websocket)


async def check_private_submission(websocket: object, submission: dict):
    """
    Check a private submitted solution to the given exercise from the given git_url.
    :param websocket: for reading the submission params and sending output messages.
    :param submission: a JSON object with at least the following fields:
           "exercise" - name of the exercise; represents a sub-folder of the "exercises" folder.
           "git_url"  - a url for cloning the student's git repository containing the submitted solution.
           must be of the form https://xxx.git.
    """
    solution = submission["solution"]
    tokenUsername = submission["tokenUsername"]
    tokenPassword = submission["tokenPassword"]
    exercise = submission["exercise"]
    ids = submission["ids"]
    name = submission["name"]
    owner_firebase_id = submission["owner_firebase_id"]
    currentDT = datetime.datetime.now()
    edit_csv_trace(str(currentDT), solution, ids, "START", name)
    if not os.path.isdir(EXERCISE_DIR + "/" + exercise):
        await tee(websocket, "exercise '{}' not found".format(EXERCISE_DIR + "/" + exercise))
        return
    repository_folder = "/submissions/{}/{}".format(
        owner_firebase_id, exercise)
    matches = GITLAB_REGEXP.search(solution)
    if matches is None:
        await tee(websocket, "Wrong format of link to github repository!")
        await tee(websocket, "Final Grade: 0")
        return
    if not os.path.isdir(EXERCISE_DIR + "/" + exercise):
        await tee(websocket, "exercise '{}' not found".format(EXERCISE_DIR + "/" + exercise))
        return
    username = matches.group(1)
    repository = GIT_CLEAN.sub("", matches.group(2))
    # Clone or pull the student's submission from github to the docker container "badkan":
    await docker_command_tee(["exec", "badkan", "bash", "get-private-submission.sh", username, repository, owner_firebase_id, exercise, tokenUsername, tokenPassword], websocket)
    await grade(solution, exercise, ids, name, owner_firebase_id, repository_folder, submission, websocket)


async def dealing_with_file(filename, websocket, owner_firebase_id, exercise):
    await docker_command_tee(["exec", "badkan", "bash", "get-submission-file.sh", owner_firebase_id, exercise], websocket)


async def dealing_with_url(git_url, websocket, owner_firebase_id, exercise):
    matches = GIT_REGEXP.search(git_url)
    username = matches.group(1)
    repository = GIT_CLEAN.sub("", matches.group(2))
    # Clone or pull the student's submission from github to the docker container "badkan":
    await docker_command_tee(["exec", "badkan", "bash", "get-submission.sh", username, repository, owner_firebase_id, exercise], websocket)


async def grade(solution, exercise, ids, name, owner_firebase_id, repository_folder, submission, websocket):
    # 1. Copy the files related to grading from the exercise folder outside docker to the submission folder inside docker:
    current_exercise_folder = os.path.realpath(EXERCISE_DIR + "/" + exercise)
    await tee(websocket, "copying from {}".format(current_exercise_folder))
    await docker_command_log(["cp", current_exercise_folder, "badkan:{}/grading_files".format(repository_folder)])

    # 2. Grade the submission inside the docker container "badkan"
    grade = None
    move_command = "mv grading_files/* . && rm -rf grading_files"
    TIMEOUT_SOFT = 10  # seconds
    TIMEOUT_HARD = 20  # seconds
    grade_command = "timeout -s 9 {} timeout {} nice -n 5 ./grade {} {}".format(
        TIMEOUT_HARD, TIMEOUT_SOFT, owner_firebase_id, exercise)
    exitcode_command = "echo Exit code: $?"
    combined_command = "{} && {} ; {}".format(
        move_command, grade_command, exitcode_command)
    proc = await old_docker_command(["exec", "-w", repository_folder, "badkan", "bash", "-c", combined_command])
    output = ""
    count = 0
    grade_regexp = get_grade_regexp(current_exercise_folder)
    while True:
        try:
            async for line in proc.stdout:  # Loop over all lines created by the "grade" script.
                line = line.decode('utf-8').strip()
                if "output:" in line:
                    output += str(count) + ":;" + \
                        line[line.find(":") + 2: len(line)] + ";"
                    count += 1
                print("> {}".format(line))
                matches = grade_regexp.search(line)
                if matches is not None:     # This line represents the student's grade.
                    await websocket.send("<p style='display:none'>"+line+"</p>\n")
                    if grade is None:       # This is the first time we find such a line.
                        grade = matches.group(1)
                        await tee(websocket, "Signed grade: {}\n".format(grade))
                    else:
                        await tee(websocket, "Signed duplicate grades\n")
                        grade = 0
                else:
                    # If the line does not contain a signature - send it to the student
                    await websocket.send(line+"\n")
        except ValueError:
            await tee(websocket, "Your program generated a very very long line! Please check it.")
            continue
        else:
            break
    await proc.wait()

    if grade is None:
        grade = 0
    await tee(websocket, "Final Grade: {}".format(grade))
    # This line is read at app/Badkan.js, in websocket.onmessage.

    currentDT = datetime.datetime.now()
    edit_csv_trace(str(currentDT), solution, ids, grade, name)
    # name, last_name, student_id, output, exercice_name
    edit_csv_summary(submission["student_name"],
                   submission["student_last_name"], ids, output, exercise)

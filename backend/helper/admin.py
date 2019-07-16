from imports_helper import *


async def run_for_admin(owner_firebase_id, exercise_id, websocket):
    repository_folder = "/submissions/{}/{}".format(
        owner_firebase_id, exercise_id)
    current_exercise_folder = os.path.realpath(
        EXERCISE_DIR + "/" + exercise_id)
    await tee(websocket, "copying from {}".format(current_exercise_folder))
    print("DEBUD ADMIN", current_exercise_folder)
    # Grade the submission inside the docker container "badkan"
    grade = None
    TIMEOUT_SOFT = 10  # seconds
    TIMEOUT_HARD = 20  # seconds
    grade_command = "timeout -s 9 {} timeout {} nice -n 5 ./grade {} {}".format(
        TIMEOUT_HARD, TIMEOUT_SOFT, owner_firebase_id, exercise_id)
    exitcode_command = "echo Exit code: $?"
    combined_command = "{} ; {}".format(grade_command, exitcode_command)
    proc = await old_docker_command(["exec", "-w", repository_folder, "badkan", "bash", "-c", combined_command])
    grade_regexp = get_grade_regexp(current_exercise_folder)
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        await tee(websocket, line)
        matches = grade_regexp.search(line)
        if matches is not None:
            grade = matches.group(1)
            await tee(websocket, "Final Grade: " + grade)
            # This line is read at app/Badkan.js, in websocket.onmessage.
    await proc.wait()
    if grade is None:
        await tee(websocket, "Final Grade: 0")


async def run_all_submissions(exercise_id, users_map, websocket):
    for user in users_map:
        await tee(websocket, "THE GRADE FOR THE STUDENT WITH THE ID " + user)
        await tee(websocket, "")
        await run_for_admin(user, exercise_id, websocket)
        await tee(websocket, "######################################")
        await tee(websocket, "")
        await tee(websocket, "")


async def load_ex(url, folder_name, username, password, exercise):
    """
    :param url: the url of the submission.
    :param folder_name: the folder_name of the solved exercise
    (it's composed of the uid of the owner + "_" + nb of exercise he created).
    :param username: the username of the deploy token to clone the private repo.
    :param password: the password of the deploy token to clone the private repo.
    :param exercise: the name of the solved exercise.
    """
    new_url = "https://" + username + ":" + password + "@" + url[8:]
    await terminal_command_log(
        ['bash', '../bash/git-clone.sh', new_url, folder_name])
    await terminal_command_log(
        ['bash', '../bash/git-clean.sh', folder_name, exercise])


async def edit_ex(folder_name, ex_folder):
    """
    :param folder_name: the folder_name of the solved exercise
    (it's composed of the uid of the owner + "_" + nb of exercise he created).
    :param exercise: the name of the folder of the solved exercise.
    """
    await terminal_command_log(
        ['bash', '../bash/git-pull.sh', folder_name, ex_folder])
    await terminal_command_log(
        ['bash', '../bash/git-clean.sh', folder_name, ex_folder])


async def delete_ex(delete_ex):
    """
    :param delete_ex: the name of the folder of the exercise to delete.
    """
    await terminal_command_log(['bash', '../bash/rm-exercise.sh', folder_name])


async def moss_command(websocket, submission):
    compiler = submission["compiler"]
    exercise_id = submission["exercise_id"]
    info = submission["info"]
    informations = info.replace("-", " ")
    await terminal_command_tee(['bash', '../../moss/exec-moss.sh', compiler, exercise_id, informations], websocket)

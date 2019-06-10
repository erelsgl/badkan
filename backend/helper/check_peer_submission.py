

async def check_test_peer_submission(websocket: object, submission: dict):
    """
    Check a submitted solution to the given peer_to_peer exercise from the given git_url or zip.
    :param websocket: for reading the submission params and sending output messages.
    :param submission: a JSON object with at least the following fields:
            exerciseId: exerciseId,
            name: peerExercise.name,
            owner_firebase_id: firebase.auth().currentUser.uid,
            student_name: homeUser.name,
            student_last_name: homeUser.lastName,
            country_id = homeUser.id,
            min_test: peerExercise.minTest,
            Signature_map: peerExercise.signatureMap

    """
    exercise_id = submission["exerciseId"]
    exercise_name = submission["name"]
    owner_firebase_id = submission["owner_firebase_id"]
    student_name = submission["student_name"]
    student_last_name = submission["student_last_name"]
    country_id = submission["country_id"]
    min_test = submission["min_test"]
    signature_map = submission["signature_map"]

    currentDT = datetime.datetime.now()
    edit_csv_trace(str(currentDT), "Zip", country_id, "START", exercise_name)

    repository_folder = "/submissions/{}/{}".format(
        owner_firebase_id, exercise_id)

    # Check if the folder exists in the docker if yes, rm everything in the folder src/test/java
    # Clean the src/main/java/ folder.
    path = "submissions/" + owner_firebase_id + "/" + exercise_id + "/src/test/java"
    proc = await docker_command(["exec", "badkan", "bash", "clean-folder.sh", path])
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        print(line)
    await proc.wait()

    # if not, create the template.
    proc = await docker_command(["exec", "badkan", "bash", "create-template-gradle.sh", owner_firebase_id, exercise_id])
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        print(line)
    await proc.wait()

    # We need here to store in the docker all the submission in the good format.
    proc = await docker_command(["exec", "badkan", "bash", "get-test-submission-file.sh", owner_firebase_id, exercise_id])
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        print(line)
    await proc.wait()

    # Clean the src/main/java/ folder.
    path = "submissions/" + owner_firebase_id + "/" + exercise_id + "/src/main/java"
    proc = await docker_command(["exec", "badkan", "bash", "clean-folder.sh", path])
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        print(line)
    await proc.wait()

    # Then, create the signature file (by using the signature map in the src/main/java folder)
    # and cp it to the docker in the good place.

    for signature in signature_map:
        info = ""
        for function in signature["func"]:
            clean_signature = function[:function.index("(")]
            info = info + function + " {\n"
            if "int" in clean_signature or "double" in clean_signature or "float" in clean_signature or "short" in clean_signature or "long" in clean_signature:
                info = info + "         return 0;"
            elif "boolean" in clean_signature:
                info = info + "         return true;"
            else:
                info = info + "         return null;"
            info = info + "\n   }"
        print(signature["cla"])
        print(info)
        proc = await docker_command(["exec", "badkan", "bash", "create-signature.sh", signature["cla"], info, owner_firebase_id, exercise_id])
        async for line in proc.stdout:
            line = line.decode('utf-8').strip()
            print(line)
        await proc.wait()

    # Then, run the gradle test command and send result to the user.
    repository_folder = "/submissions/{}/{}".format(
        owner_firebase_id, exercise_id)
    command = "gradle test"
    proc = await docker_command(["exec", "-w", repository_folder, "badkan", "bash", "-c", command])
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        if ":compileTestJava" == line or ":compileTestJava UP-TO-DATE" == line:
            await tee(websocket, "Your submission compile successfuly!")
            return  # No more interest: we only show the compilation.
        elif line == "Execution failed for task ':compileJava'.":
            await tee(websocket, "There is a problem with the signature, please check with the instructor!")
            return  # No more interest: we only show the compilation.
        await tee(websocket, line)
    await proc.wait()


# TODO: When the submission phase begin, we'll have to rm the signature
# file (all the files.java in the src/main/java folder).
async def check_solution_peer_submission(websocket: object, submission: dict):
    """
     target: "check_solution_peer_submission",
           exerciseId: exerciseId,
           name: exercise.name,
           owner_firebase_id: firebase.auth().currentUser.uid,
           student_name: homeUser.name,
           student_last_name: homeUser.lastName,
           country_id: homeUser.id,
    """
    exercise_id = submission["exerciseId"]
    exercise_name = submission["name"]
    owner_firebase_id = submission["owner_firebase_id"]
    student_name = submission["student_name"]
    student_last_name = submission["student_last_name"]
    country_id = submission["country_id"]

    # rm everything in allthe folder src/main/java
    path = "submissions/" + "*" + "/" + exercise_id + "/src/main/java"
    proc = await docker_command(["exec", "badkan", "bash", "clean-folder.sh", path])
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        print(line)
    await proc.wait()

    # We need here to store in the docker all the submission in the good format.
    proc = await docker_command(["exec", "badkan", "bash", "get-solution-submission-file.sh", owner_firebase_id, exercise_id])
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        print(line)
    await proc.wait()

    proc = await docker_command(["exec", "-w", "", "badkan", "bash", "-c", "echo submissions/*/" + exercise_id])
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
    await proc.wait()

    # Then, run the gradle test command to all the folder and send result to the user.
    # Send the index.html produced by Gradle corp.
    projects = line.split(" ")
    it = 1
    for repository_folder in projects:
        repository_folder_splited = repository_folder.split("/")
        test_id = repository_folder_splited[1]
        await tee(websocket, "RESULT FOR TEST NUMBER " + str(it) + ":")
        await tee(websocket, "INDICATION FOR BACKEND:" + test_id)
        it = it + 1
        command = "gradle test"
        proc = await docker_command(["exec", "-w", "/" + repository_folder, "badkan", "bash", "-c", command])
        flag_test_division = False
        next_line = False
        array_test = []
        async for line in proc.stdout:
            line = line.decode('utf-8').strip()
            if line == ":test" or flag_test_division:
                flag_test_division = True
                if next_line:

                    next_line = False
                    info = line[line.find("at") + 3:]
                    splited = info.split(":")
                    proc = await docker_command(["exec", "-w", "/" + repository_folder
                                                 + "/src/test/java", "badkan", "bash", "-c", "cat < \"" + splited[0] + "\""])
                    new_file = ""
                    async for test_line in proc.stdout:
                        test_line = test_line.decode('utf-8').strip()
                        new_file = new_file + "\n" + test_line
                    test_case = extract_test(new_file, splited[1])
                    await tee(websocket, test_case)
                    array_test.append(test_case)
                if "FAILED" in line:
                    next_line = True
                if "tests completed" in line:
                    flag_test_division = False
            if "FAILED" in line and ">" in line:
                function_name = line[line.find(">") + 2:len(line) - 6]
                await tee(websocket, "INDICATION FOR BACKEND FUNCTION:" + function_name)
            await tee(websocket, line)
        await proc.wait()

from server import docker_command

def get_all_submission(peer_exercise_id):
    proc = await docker_command(["exec", "-w", "", "badkan", "bash", "-c", "echo submissions/*/" + peer_exercise_id])
        async for line in proc.stdout:
            line = line.decode('utf-8').strip()
        await proc.wait()

        # Then, run the gradle test command to all the folder and send result to the user.
        # Send the index.html produced by Gradle corp.
        projects = line.split(" ")
        print(projects)

get_all_submission("CGnS3FbQcVZaDMNMl4BZolViHWv1_5")
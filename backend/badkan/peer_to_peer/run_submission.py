import websockets
import asyncio
import os
import json
import re
import sys
import datetime
                                                                                                        
async def docker_command(command_words):
    """
    :param command_words: a list of words to be executed by docker.
    :return: a stream that contains all output of the command (stdout and stderr together)
    """
    return await asyncio.subprocess.create_subprocess_exec(
        *(["docker"] + command_words),
        stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.STDOUT)


def get_all_submission(peer_exercise_id):
    proc = await docker_command(["exec", "-w", "", "badkan", "bash",
                           "-c", "echo submissions/*/" + peer_exercise_id])
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
    await proc.wait()

    # Then, run the gradle test command to all the folder and send result to the user.
    # Send the index.html produced by Gradle corp.
    projects = line.split(" ")
    print(projects)


get_all_submission("CGnS3FbQcVZaDMNMl4BZolViHWv1_5")

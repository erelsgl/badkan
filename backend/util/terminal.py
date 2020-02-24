"""
Utility functions: clone git repository, pull git repository, remove path
"""

import subprocess
from subprocess import call
import asyncio
import re
import json

GRADE_REGEXP = re.compile("Grade: ([0-9]+)", re.IGNORECASE)
OUTPUT_REGEXP = re.compile("Your output is (.*)", re.IGNORECASE)
INPUT_REGEXP = re.compile("The input is (.*)", re.IGNORECASE)


async def tee(websocket, message):
    """
    Send a message both to the backend screen and to the frontend client.
    """
    print("> {}".format(message))
    await websocket.send(message)


async def log_process_async(proc):
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        print(line)


def log_process(proc):
    for line in proc.stdout:
        line = line.decode('utf-8').strip()
        print(line)


async def tee_process_async(proc, websocket):
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        await tee(websocket, line)


async def tee_process(proc, websocket):
    for line in proc.stdout:
        line = line.decode('utf-8').strip()
        await tee(websocket, line)


def terminal_command(args):
    return subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)


async def docker_command(args):
    return await asyncio.subprocess.create_subprocess_exec(
        *(["docker"] + args),
        stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.STDOUT)


async def terminal_command_log(args):
    proc = terminal_command(args)
    log_process(proc)
    proc.wait()


async def terminal_command_return(args):
    proc = terminal_command(args)
    answer = ""
    for line in proc.stdout:
        answer += line.decode('utf-8').strip()
    return answer


async def terminal_command_tee(args, websocket):
    proc = terminal_command(args)
    await tee_process(proc, websocket)
    proc.wait()


async def docker_command_log(args):
    proc = await docker_command(args)
    await log_process_async(proc)
    await proc.wait()


async def docker_command_tee(args, websocket):
    proc = await docker_command(args)
    await tee_process_async(proc, websocket)
    await proc.wait()


async def docker_command_tee_with_grade(args, websocket, show_input, show_output, signature, output=None):
    proc = await docker_command(args)
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        print(line)
        if not signature in line:
            answer = {'message': line}
            match_output = OUTPUT_REGEXP.search(line)
            match_input = INPUT_REGEXP.search(line)
            if output is not None and match_output:
                output.append(match_output.group(1))
            if match_input and not show_input:
                continue
            if match_output and not show_output:
                continue
            if not match_input and not match_output:
                answer["style"] = "color:red"
                await tee(websocket,  json.dumps(answer))
            else:
                answer["style"] = "color:black"
                await tee(websocket, json.dumps(answer))
        else:
            grade = line[line.find(' '):]
            answer["message"] = 'Your final grade is: ' + grade
            answer["style"] = "color:green"
            await tee(websocket, json.dumps(answer))
            return grade
    await proc.wait()


async def docker_command_custom_exercise(folder_name, correction_url, websocket):
    proc = await docker_command(["exec", "badkan", "bash", "run_custom.sh", folder_name, correction_url])

    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        GRADE_REGEXP = re.findall("Grade: ([0-9]+)",line)
        substring = "Grade:"

        count = line.count(substring)

        if GRADE_REGEXP:
            grade = int(GRADE_REGEXP[0])
            line = line.replace("Grade:","Your grade is ")
        if count>1:
            grade=0
        
        
        await tee(websocket, line)

        # regex
        # TODO: JEREMY.
        # check if the line include "grade: x" and return the grade.
        # make it flexible to include a secure scheme in the future.
        # save the grade on the firebase realtime database and check if it's stored.
        # check if the submission is stored on the firebase storage.
        # check if the options in the manage page still work: run submission, download submission...
        # make tests (check for example if submit twice in a raw).
        # compte badkan: https://github.com/badkan
        # https://gitlab.com/erelsgl/ariel-cpp-5779-homework -> erel exercises.
        # one answer for the test exercise is: https://github.com/AtaraZohar/Cpp-binaryTree (should get 100).
        # change the home page render.
    return grade
    # await proc.wait()
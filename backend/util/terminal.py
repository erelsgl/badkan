"""
Utility functions: clone git repository, pull git repository, remove path
"""

import subprocess
from subprocess import call
import asyncio
import re
import json
import sys

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
    print(args)
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


async def docker_command_custom_exercise(folder_name, correction_url, websocket, isZip, github_submission):
    if isZip:
        exercise_id = correction_url
        if github_submission:
            proc = await docker_command(["exec", "badkan", "bash", "run_custom_by_zip.sh", folder_name, exercise_id])

        else:
            proc = await docker_command(["exec", "badkan", "bash", "run_zip_submission_with_zip_exercise.sh", folder_name, exercise_id])

    else:
        proc = await docker_command(["exec", "badkan", "bash", "run_custom.sh", folder_name, correction_url])
    count_cheat = 0
    grade=0
    async for line in proc.stdout:
        try:
            
            line = line.decode('utf-8').strip()

            GRADE_REGEXP = re.findall("Grade: ([0-9]+)",line)
            line = line.replace("Grade:","Your grade is ")
            
            if GRADE_REGEXP:
                grade = int(GRADE_REGEXP[0])

            substring = "Your grade is"
            if line.count(substring):
               count_cheat+=1 

            if count_cheat > 1:
                print("CHEATING")
                grade = 0
                await tee(websocket, "You tried to cheat, your stored grade is 0")
                return grade

            await tee(websocket, line)
        except:
            await tee(websocket, str(sys.exc_info()[0]))

    return grade
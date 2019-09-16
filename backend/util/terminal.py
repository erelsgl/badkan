"""
Utility functions: clone git repository, pull git repository, remove path
"""

import subprocess
from subprocess import call
import asyncio
import re

GRADE_REGEXP = re.compile("\*\*\* ([0-9]+) \*\*\*", re.IGNORECASE)
OUTPUT_REGEXP = re.compile("Your output is (.*)", re.IGNORECASE)


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
    return subprocess.Popen(args, stdout=subprocess.PIPE)


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


async def docker_command_tee_with_grade(args, websocket, output=None):
    proc = await docker_command(args)
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        match_grade = GRADE_REGEXP.search(line)
        if not match_grade:
            match_output = OUTPUT_REGEXP.search(line)
            if output is not None and match_output:
                output.append(match_output.group(1))
            await tee(websocket, line)
        else:
            grade = match_grade.group(1)
            return grade
    await proc.wait()

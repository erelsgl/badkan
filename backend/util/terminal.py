"""
Utility functions: clone git repository, pull git repository, remove path
"""

import subprocess
from subprocess import call
import asyncio


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

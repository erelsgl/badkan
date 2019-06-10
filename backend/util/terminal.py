"""
Utility functions: clone git repository, pull git repository, remove path
"""

import subprocess
from subprocess import call
import asyncio


def git_clone(url, folder_name, username, password, exercise):
    """
    :param url: the url of the submission.
    :param folder_name: the folder_name of the solved exercise 
    (it's composed of the uid of the owner + "_" + nb of exercise he created).
    :param username: the username of the deploy token to clone the private repo.
    :param password: the password of the deploy token to clone the private repo.
    :param exercise: the name of the solved exercise.
    """
    new_url = "https://" + username + ":" + password + "@" + url[8:]
    terminal_command(
        ['bash', '../bash/git-clone.sh', new_url, folder_name])
    terminal_command(
        ['bash', '../bash/git-clean.sh', folder_name, exercise])


def git_pull(folder_name, ex_folder):
    """
    :param folder_name: the folder_name of the solved exercise 
    (it's composed of the uid of the owner + "_" + nb of exercise he created).
    :param ex_folder: the name of the folder of the solved exercise.
    """
    terminal_command(
        ['bash', '../bash/git-pull.sh', folder_name, ex_folder])
    terminal_command(
        ['bash', '../bash/git-clean.sh', folder_name, ex_folder])


def rmv(folder_name):
    """
    :param folder_name: the name of the folder of the exercise to delete.
    """
    terminal_command(['bash', '../bash/rm-exercise.sh', folder_name])


async def old_docker_command(command_words):
    """
    :param command_words: a list of words to be executed by docker.
    :return: a stream that contains all output of the command (stdout and stderr together)
    """
    return await asyncio.subprocess.create_subprocess_exec(
        *(["docker"] + command_words),
        stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.STDOUT)


async def tee(websocket, message):
    """
    Send a message both to the backend screen and to the frontend client.
    """
    print("> {}".format(message))
    await websocket.send(message)


async def log_process(proc):
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        print(line)


async def tee_process(proc, websocket):
    async for line in proc.stdout:
        line = line.decode('utf-8').strip()
        await tee(websocket, line)


def terminal_command(args):
    proc = subprocess.Popen(args, stdout=subprocess.PIPE)
    log_process(proc)
    proc.wait()


async def docker_command(args):
    return await asyncio.subprocess.create_subprocess_exec(
        *(["docker"] + args),
        stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.STDOUT)


async def docker_command_log(args):
    proc = await docker_command(args)
    await log_process(proc)
    await proc.wait()


async def docker_command_tee(args, websocket):
    proc = await docker_command(args)
    await tee_process(proc, websocket)
    await proc.wait()

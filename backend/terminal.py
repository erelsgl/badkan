import subprocess
from subprocess import call
import os

def git_clone(path, url, folder_name):
    os.chdir(path)
    call(["git", "clone", url, folder_name])

def git_clone_force(path, url, folder_name):
    os.chdir(path)
    call(["git", "clone", url, "temp"])
    call(["mv", "temp/.git", folder_name + "/.git"])
    call(["rm", "-rf", "temp"])


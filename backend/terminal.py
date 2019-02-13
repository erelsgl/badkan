import subprocess
from subprocess import call
import os

def git_clone(path, url, folder_name):
    os.chdir(path)
    call(["git", "clone", url, folder_name])

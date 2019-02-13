import subprocess
from subprocess import call
import os

def git_clone(path, url, folder_name, username, password):
    os.chdir(path)
    new_url = "https://" + username + ":" + password + "@" + url[8:] + ".git"
    call(["git", "clone", new_url, folder_name])

def git_clone_force(path, url, folder_name, username, password):
    os.chdir(path)
    new_url = "https://" + username + ":" + password + "@" + url[8:] + ".git"
    call(["git", "clone", new_url, "temp"])
    call(["rm", "-rf", folder_name])
    call(["mv", "temp", folder_name])

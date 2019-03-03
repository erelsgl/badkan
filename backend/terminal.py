import subprocess
from subprocess import call
import os

def git_clone(path, url, folder_name, username, password, exercise):
    owd = os.getcwd()
    os.chdir(path)
    new_url = "https://" + username + ":" + password + "@" + url[8:]
    call(["git", "clone", new_url, folder_name])
    os.chdir(path + "/" + folder_name)
    os.system("ls | grep -v " + exercise + " | xargs rm -r")
    os.chdir(owd)


def git_pull(path, folder_name, ex_folder):
    owd = os.getcwd()
    os.chdir(path + "/" + folder_name + "/" + ex_folder)
    call(["git", "pull"])
    os.chdir(owd)

def rmv(path, folder_name):
    owd = os.getcwd()
    os.chdir(path)
    os.system("rm -r " + folder_name)
    os.chdir(owd)

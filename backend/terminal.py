"""
Utility functions: clone git repository, pull git repository, remove path
"""

import subprocess
from subprocess import call
import os

def git_clone(path, url, folder_name, username, password, exercise):
    """
    :param path: the path to clone the repo.
    :param url: the url of the submission.
     :param folder_name: the folder_name of the solved exercise 
    (it's composed of the uid of the owner + "_" + nb of exercise he created).
    :param username: the username of the deploy token to clone the private repo.
    :param password: the password of the deploy token to clone the private repo.
    :param exercise: the name of the solved exercise.
    """
    owd = os.getcwd()
    os.chdir(path)
    new_url = "https://" + username + ":" + password + "@" + url[8:]
    call(["git", "clone", new_url, folder_name])
    os.chdir(path + "/" + folder_name)
    os.system("ls | grep -v " + exercise + " | xargs rm -r")
    os.chdir(owd)
    shellscript = subprocess.Popen(
        ['bash', 'bash/git-clean.sh', folder_name, exercise], stdout=subprocess.PIPE)
    shellscript.wait()

def git_pull(path, folder_name, ex_folder):
    """
    :param path: the path to clone the repo.
    :param folder_name: the folder_name of the solved exercise 
    (it's composed of the uid of the owner + "_" + nb of exercise he created).
    :param ex_folder: the name of the folder of the solved exercise.
    """
    shellscript = subprocess.Popen(
        ['bash', 'bash/git-pull.sh', folder_name, ex_folder], stdout=subprocess.PIPE)
    shellscript.wait()
    shellscript = subprocess.Popen(
        ['bash', 'bash/git-clean.sh', folder_name, ex_folder], stdout=subprocess.PIPE)
    shellscript.wait()

def rmv(path, folder_name):
    """
    :param path: the path to delete the repo.
    :param delete_ex: the name of the folder of the exercise to delete.
    """
    owd = os.getcwd()
    os.chdir(path)
    os.system("rm -r " + folder_name)
    os.chdir(owd)
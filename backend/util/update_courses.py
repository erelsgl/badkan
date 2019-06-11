"""
This script should be called whenever there is any change in Firebase
in either "courses" or "exercises".
"""

import requests
import json
import os
import datetime
import util
import re

from terminal import terminal_command_log


def update_courses():
    currentDT = datetime.datetime.now()
    util.edit_csv_trace(time=str(currentDT), url="", ids="",
                        grade="UPDATE_COURSES", name="")

    DIR = os.path.dirname(os.path.realpath(__file__))

    with open('../../frontend/util/FirebaseConfig.js') as dataFile:
        data = dataFile.read()
    id = re.search('projectId: "(.+?)",', data)
    FIREBASE_APP = id.group(1)

    url = 'https://'+FIREBASE_APP + '.firebaseio.com/courses.json?format=export'
    r = requests.get(url)
    if r.status_code != 200:
        raise(RuntimeError("Error in reading {}: code is {}".format(url, r.status_code)))
    coursesObject = r.json()

    url = 'https://'+FIREBASE_APP + '.firebaseio.com/exercises.json?format=export'
    r = requests.get(url)
    if r.status_code != 200:
        raise(RuntimeError("Error in reading {}: code is {}".format(url, r.status_code)))
    exercisesObject = r.json()

    if coursesObject:
        for courseKey, courseData in coursesObject.items():
            course = courseData["course"]
            if "exercises" in course:
                print("sorting course ", courseKey, flush=True)
                exercises = course["exercises"]
                exercises[:] = [
                    exId for exId in exercises if exId in exercisesObject]
                exercises.sort(
                    key=lambda exerciseKey: exercisesObject[exerciseKey]["exercise"]["name"])
            else:
                print("course ", courseKey,
                      " has no exercises object", flush=True)

    with open(DIR+"/../../frontend/data/courses.js", "w") as file:
        file.write("// Updated at "+str(currentDT)+"\n")
        file.write("coursesObject=")
        file.write(json.dumps(coursesObject))

    with open(DIR+"/../../frontend/data/exercises.js", "w") as file:
        file.write("// Updated at "+str(currentDT)+"\n")
        file.write("exercisesObject=")
        file.write(json.dumps(exercisesObject))

    if os.path.exists('/var/www/html/'):
        terminal_command_log(['bash', '../bash/cp-data.sh'])


if __name__ == "__main__":
    update_courses()

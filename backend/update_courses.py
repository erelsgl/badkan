"""
This script should be called whenever there is any change in Firebase
in either "courses" or "exercises".
"""

import requests
import json, os, datetime
import util

def update_courses():
    currentDT = datetime.datetime.now()
    util.edit_csv_trace(time=str(currentDT), url="", ids="", grade="UPDATE_COURSES", name="")


    DIR=os.path.dirname(os.path.realpath(__file__))
    FIREBASE_APP="badkan-9d48d"

    r = requests.get('https://'+FIREBASE_APP+'.firebaseio.com/courses.json?format=export')
    coursesObject = r.json()

    r = requests.get('https://'+FIREBASE_APP+'.firebaseio.com/exercises.json?format=export')
    exercisesObject = r.json()

    for courseKey,courseData in coursesObject.items():
        print("sorting course ",courseKey, flush=True)
        exercises = courseData["course"]["exercises"]
        exercises[:] = [exId for exId in exercises if exId in exercisesObject]
        exercises.sort(
            key=lambda exerciseKey: exercisesObject[exerciseKey]["exercise"]["name"])

    with open(DIR+"/../frontend/data/courses.js","w") as file:
        file.write("coursesObject=")
        file.write(json.dumps(coursesObject))

    with open(DIR+"/../frontend/data/exercises.js","w") as file:
        file.write("exercisesObject=")
        file.write(json.dumps(exercisesObject))


if __name__ == "__main__":
    update_courses()


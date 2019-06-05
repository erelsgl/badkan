import requests
import json, os, sys

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


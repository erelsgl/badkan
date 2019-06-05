import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

import re

with open('../../frontend/util/FirebaseConfig.js') as dataFile:
    data = dataFile.read()

id = re.search('projectId: "(.+?)",', data)

url = 'https://' + id.group(1) + '.firebaseio.com'
cred = credentials.Certificate('../../database_exports/private_key.json')
firebase_admin.initialize_app(cred, {'databaseURL': url})

# User side.


def delete_exercise_solved():
    ref = db.reference('users/')
    for user in ref.get():
        new_ref = db.reference('users/' + user + '/user/exerciseSolved')
        new_ref.set({})

# Exercise side.


def delete_grades():
    ref = db.reference('exercises/')
    for exercise in ref.get():
        new_ref = db.reference('exercises/' + exercise + '/exercise/grades')
        new_ref.set({})


delete_exercise_solved()
delete_grades()

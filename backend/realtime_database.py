import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

import re

with open('../frontend/util/FirebaseConfig.js') as dataFile:
    data = dataFile.read()

id = re.search('projectId: "(.+?)",', data)

url = 'https://' + id.group(1) + '.firebaseio.com'
cred = credentials.Certificate('../database_exports/private_key.json')
firebase_admin.initialize_app(cred, {'databaseURL': url})


def write_conflict(owner_firebase_id, test_id ,str_test, exercise_id):
    ref = db.reference('conflicts/' + exercise_id + "/" + owner_firebase_id + "_" +  test_id)
    ref.set({
            'solution_id' : owner_firebase_id,
            'test_id' : test_id,
            'test' : str_test,
            'exercise_id' : exercise_id
    })



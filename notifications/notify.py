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

# https://badkanlab.firebaseio.com/peerExercises/CGnS3FbQcVZaDMNMl4BZolViHWv1_24/peerExercise/deadlineConflicts
def retreive_conflicts_deadline():
    ref = db.reference('peerExercises/')
    snapshot = ref.order_by_child('notworking').get()
    for key, val in snapshot.items():
        print('{0} was {1} meters tall'.format(key, val))


retreive_conflicts_deadline()
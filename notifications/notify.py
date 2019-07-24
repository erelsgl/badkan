import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

import datetime
import re

with open('../frontend/util/firebaseConfig.js') as dataFile:
    data = dataFile.read()

id = re.search('projectId: "(.+?)",', data)

url = 'https://' + id.group(1) + '.firebaseio.com'
cred = credentials.Certificate('../database_exports/private_key.json')
firebase_admin.initialize_app(cred, {'databaseURL': url})

def send_notif(user_id, exercise_id):
    ref = db.reference('users/' + user_id + "/user/notif")
    index = len(ref.get())
    new_ref = db.reference('users/' + user_id + "/user/notif/" + str(index))
    new_ref.set({
        "action" : "viewPeerExercise.html?" + exercise_id,
        "notifMessage" : "Your peer to peer exercise deadline is over.",
        "notifRead": False
    })

def retreive_conflicts_deadline():
    ref = db.reference('peerExercises/') 
    for exercise in ref.get():
        new_ref = db.reference('peerExercises/' + exercise + "/peerExercise/deadlineConflicts")
        deadline = datetime.datetime.strptime(new_ref.get(), '%Y-%m-%d')
        if datetime.datetime.now().date() == deadline.date():
            user_ref = db.reference('peerExercises/' + exercise + "/peerExercise/ownerId")
            send_notif(user_ref.get(), exercise)

retreive_conflicts_deadline()
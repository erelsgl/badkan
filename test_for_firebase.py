import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

import re

with open('frontend/util/FirebaseConfig.js') as dataFile:
    data = dataFile.read()

id = re.search('projectId: "(.+?)",', data)

url = 'https://' + id.group(1) + '.firebaseio.com'
cred = credentials.Certificate('database_exports/private_key.json')
firebase_admin.initialize_app(cred, {'databaseURL': url})

def test():
    print()
    ref = db.reference('submission/')
    ref.push({111 : "exerciseid", 222 : "userid1"})
    ref.push({111 : "exerciseid", 222 : "userid1", 333 : "userid2"})
    ref.push({111 : "exerciseid", 222 : "userid1", 333 : "userid2", 444 : "userid3"})
   
def retreive():
    ref = db.reference('submission/')
    print(ref.get())

test()
retreive()
import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage

import re

with open('../frontend/util/firebaseConfig.js') as dataFile:
    data = dataFile.read()

id = re.search('projectId: "(.+?)",', data)

cred = credentials.Certificate('private_key.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': id.group(1) + '.appspot.com'
})

firebase_two_hours = open("02-hours.json", "rb")
firebase_height_hours = open("08-hours.json", "rb")
firebase_tweny_four_hours = open("24-hours.json", "rb")
firebase_ninety_six_hours = open("96-hours.json", "rb")
firebase_before_backend_update = open("before-backend-update.json", "rb")

exercises = open("exercises-backup.tar.gz", "rb")

bucket = storage.bucket()

blob = bucket.blob('02-hours.json')
blob.upload_from_file(firebase_two_hours)

blob = bucket.blob('08-hours.json')
blob.upload_from_file(firebase_height_hours)

blob = bucket.blob('24-hours.json')
blob.upload_from_file(firebase_tweny_four_hours)

blob = bucket.blob('96-hours.json')
blob.upload_from_file(firebase_ninety_six_hours)

blob = bucket.blob('before-backend-update.json')
blob.upload_from_file(firebase_before_backend_update)

blob = bucket.blob('exercises-backup.tar.gz')
blob.upload_from_file(exercises)

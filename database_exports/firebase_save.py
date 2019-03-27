import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage

cred = credentials.Certificate('badkanlocal-firebase-adminsdk-d2c3x-64b6330e5a.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'badkanlocal.appspot.com'
})

f = open("test.txt", "rb")

bucket = storage.bucket()

blob = bucket.blob('test.txt')

blob.upload_from_file(f)

print(blob.public_url)

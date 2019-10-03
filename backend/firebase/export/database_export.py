import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import storage

import re
import json

with open("../private_key.json") as dataFile:
    data = dataFile.read()

id = re.search('"project_id": "(.+?)",', data)
project_name = id.group(1)

url = 'https://' + project_name + '.firebaseio.com'
bucket_name = project_name + '.appspot.com'

cred = credentials.Certificate('../private_key.json')
firebase_admin.initialize_app(
    cred, {'databaseURL': url, 'storageBucket': bucket_name})

bucket = storage.bucket()

filename = input() + '.json'

export_file_location = "../../../database_exports/" + filename

ref = db.reference('')

with open(export_file_location, "w+") as export_file:
    export_file.write(json.dumps(ref.get()))

blob = bucket.blob('database_exports/'+filename)
blob.upload_from_filename(export_file_location)

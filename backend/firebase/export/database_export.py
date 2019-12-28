import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import storage

import re
import json
import sys
import os.path

fdir = os.path.abspath(os.path.dirname(__file__))

private_key = fdir + '/../private_key.json'

with open(private_key) as dataFile:
    data = dataFile.read()

id = re.search('"project_id": "(.+?)",', data)
project_name = id.group(1)

url = 'https://' + project_name + '.firebaseio.com'
bucket_name = project_name + '.appspot.com'

cred = credentials.Certificate(private_key)
firebase_admin.initialize_app(
    cred, {'databaseURL': url, 'storageBucket': bucket_name})

bucket = storage.bucket()

filename = sys.argv[1] + '.json'

export_file_location = "/../../../database_exports/" + filename

ref = db.reference('')

json_file =  fdir + export_file_location 

with open(json_file, "w+") as export_file:
    export_file.write(json.dumps(ref.get()))

blob = bucket.blob('database_exports/'+filename)
blob.upload_from_filename(json_file)

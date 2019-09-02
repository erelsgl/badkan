import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import auth
from firebase_admin import storage

import re
# import sys

# sys.path.append("../util")

# from terminal import *

with open('../../frontend/util/firebaseConfig.js') as dataFile:
    data = dataFile.read()

id = re.search('projectId: "(.+?)",', data)

url = 'https://' + id.group(1) + '.firebaseio.com'
bucket_name = id.group(1) + '.appspot.com'

cred = credentials.Certificate('../../database_exports/private_key.json')
firebase_admin.initialize_app(
    cred, {'databaseURL': url, 'storageBucket': bucket_name})

bucket = storage.bucket()

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import auth

import re
import sys

sys.path.append("../util")

from terminal import *

with open('../../frontend/util/FirebaseConfig.js') as dataFile:
    data = dataFile.read()

id = re.search('projectId: "(.+?)",', data)

url = 'https://' + id.group(1) + '.firebaseio.com'
cred = credentials.Certificate('../../database_exports/private_key.json')
firebase_admin.initialize_app(cred, {'databaseURL': url})

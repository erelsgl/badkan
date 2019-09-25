import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import auth
from firebase_admin import storage

import re
from datetime import datetime
import os 
import concurrent.futures
import multiprocessing as mp

import time

import sys

sys.path.append("../util")

from terminal import *

executor = concurrent.futures.ThreadPoolExecutor(max_workers=20)

with open('../../frontend/util/firebaseConfig.js') as dataFile:
    data = dataFile.read()

id = re.search('projectId: "(.+?)",', data)
project_name =  id.group(1)

url = 'https://' + project_name + '.firebaseio.com'
bucket_name = project_name + '.appspot.com'

cred = credentials.Certificate('../../database_exports/private_key.json')
firebase_admin.initialize_app(
    cred, {'databaseURL': url, 'storageBucket': bucket_name})

bucket = storage.bucket()

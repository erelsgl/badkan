import re
import json
import os
import asyncio
import websockets
import sys

sys.path.append("../util")
sys.path.append("../helper")
sys.path.append("../firebase")


from terminal import *
from util import *
from update_courses import *
from check_normal_submission import *
from check_peer_submission import *
from admin import *
from auth import *


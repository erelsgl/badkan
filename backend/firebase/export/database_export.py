from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession
import re

# Define the required scopes
scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/firebase.database"
]

# Authenticate a credential with the service account
credentials = service_account.Credentials.from_service_account_file(
    "../../../database_exports/private_key.json", scopes=scopes)

with open('../../../frontend/util/firebaseConfig.js') as dataFile:
    data = dataFile.read()

id = re.search('projectId: "(.+?)",', data)
project_name = id.group(1)

# Use the credentials object to authenticate a Requests session.
authed_session = AuthorizedSession(credentials)
response = authed_session.get(
    "https://" + project_name + ".firebaseio.com/.json")

print(response.json())

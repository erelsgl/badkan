from import_firebase import *
from realtime import *
import json


# Start listing users from the beginning, 1000 at a time.
page = auth.list_users()
while page:
    for user in page.users:
        print('User: ' + user.uid)
    # Get next batch of users.
    page = page.get_next_page()

# Iterate through all users. This will still retrieve users in batches,
# buffering no more than 1000 users in memory at a time.
for user in auth.list_users().iterate_all():
    print('User: ' + user.uid)
    print(user.email)
    print(user.phone_number)
    print(user.email_verified)
    # print(user.password)
    print(user.display_name)
    print(user.photo_url)
    print(user.disabled)

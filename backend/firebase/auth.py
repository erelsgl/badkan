from import_firebase import *
from realtime import *


async def create_auth(websocket, submission):
    try:
        user = auth.create_user(
            email=submission["email"],
            password=submission["pass"],
            display_name=submission["name"] + " " + submission["lastName"])
        edit_admin(submission["checked"], submission["id"], user.uid)
        await tee(websocket, "success")
    except Exception as e:
        await tee(websocket, str(e))


async def create_auth_github(websocket, submission):
    try:
        edit_admin(submission["checked"], submission["country_id"], submission["uid"])
        await tee(websocket, "success")
    except Exception as e:
        await tee(websocket, str(e))



async def edit_auth(user):
    user = auth.update_user(
        uid,
        email='user@example.com',
        password='newPassword',
        display_name='John Doe',
        photo_url='http://www.example.com/12345678/photo.png',
        disabled=True)
    print('Sucessfully updated user: {0}'.format(user.uid))


async def delete_auth(uid):
    auth.delete_user(uid)
    print('Successfully deleted user')


def retreive_auth(uid):
    user = auth.get_user(uid)
    print('Successfully fetched user data: {0}'.format(user.uid))
    print(user)

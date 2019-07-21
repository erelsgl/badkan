from import_firebase import *
from realtime import *


def create_new_auth(submission):
    try:
        user = auth.create_user(
            email=submission["email"],
            password=submission["pass"],
            display_name=submission["name"] + " " + submission["lastName"])
        edit_admin(submission["checked"], submission["id"], user.uid)
        return "success"
    except Exception as e:
        return str(e)


async def create_auth_github(websocket, submission):
    try:
        edit_admin(submission["checked"],
                   submission["country_id"], submission["uid"])
        await tee(websocket, "success")
    except Exception as e:
        await tee(websocket, str(e))


def get_user_auth_data(uid):
    user = auth.get_user(uid)
    # print('Successfully fetched user data: {0}'.format(user.uid))
    return user


def disable_account(uid):
    user = auth.update_user(
        uid,
        disabled=True)
    return "success"


async def edit_auth(user):
    user = auth.update_user(
        uid,
        email='user@example.com',
        password='newPassword',
        display_name='John Doe',
        photo_url='http://www.example.com/12345678/photo.png',
        disabled=True)
    print('Sucessfully updated user: {0}'.format(user.uid))

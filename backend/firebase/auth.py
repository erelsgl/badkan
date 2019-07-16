from import_firebase import *
from realtime import *


async def create_auth(websocket, submission):
    try:
        user = auth.create_user(
            uid=submission["id"],
            email=submission["email"],
            password=submission["pass"],
            display_name=submission["name"] + " " + submission["lastName"])
        edit_admin(submission["checked"], submission["id"])
        await tee(websocket, "success")
    except Exception as e:
        await tee(websocket, str(e))


async def create_auth_github(websocket, submission):
    users = [
        auth.ImportUserRecord(
            uid=submission["id"],
            display_name=submission["display_name"],
            email=submission["email"],
            provider_data=[  # user with Google provider
                auth.UserProvider(
                    uid=submission["display_name"],
                    email=submission["email"],
                    provider_id='github.com'
                )
            ],
        ),
    ]
    try:
        result = auth.import_users(users)
        edit_admin(submission["checked"], submission["id"])
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

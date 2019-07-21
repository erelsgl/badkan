from import_firebase import *
from realtime import *


def create_new_auth(submission):
    try:
        user = auth.create_user(
            email=submission["email"],
            password=submission["pass"],
            display_name=submission["name"] + " " + submission["lastName"])
        edit_admin(user.uid, submission["checked"], submission["id"])
        return "success"
    except Exception as e:
        return str(e)


def create_new_auth_github(submission):
    try:
        edit_admin( submission["uid"], submission["checked"],
                   submission["country_id"])
        return "success"
    except Exception as e:
        return str(e)


def get_user_auth_data(uid):
    user = auth.get_user(uid)
    return user


def disable_account(uid):
    user = auth.update_user(
        uid,
        disabled=True)


def edit_auth(uid, display_name):
    user = auth.update_user(
        uid,
        display_name=display_name)

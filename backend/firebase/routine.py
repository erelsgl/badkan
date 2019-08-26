from import_firebase import *
from auth import *


def retrieve_user_data(uid):
    user_data = get_user_details_data(uid)
    user_data["display_name"] = get_user_auth_data(uid).display_name
    return user_data


def edit_user_routine(response):
    uid = response["uid"]
    edit_auth(uid, response["display_name"])
    edit_realtime(uid, response["country_id"])
    return "success"
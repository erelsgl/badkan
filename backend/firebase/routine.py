from import_firebase import *
from auth import *


async def get_user_data(websocket, uid):
    user_data = get_user_details_data(uid)
    user_data["display_name"] = get_user_auth_data(uid).display_name
    await tee(websocket, str(user_data))
    

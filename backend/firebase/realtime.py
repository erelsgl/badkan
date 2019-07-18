from import_firebase import *


def edit_admin(checked, user_country_id, user_id):
    ref = db.reference('userDetails')
    user_ref = ref.child(user_id)
    user_ref.update({
        'instructor': str(checked),
        'country_id': user_country_id
    })


async def delete_account(user_id):
    ref = db.reference('userDetails')
    user_ref = ref.child(user_id)
    user_ref.update({
        'deleted_user': "True"
    })

async def get_data_user(websocket, user_id):
    ref = db.reference('userDetails/'+user_id)
    print(ref.get())
    await tee(websocket, str(ref.get()))
from import_firebase import *


def edit_admin(checked, user_id):
    ref = db.reference('userDetails')
    user_ref = ref.child(user_id)
    user_ref.update({
        'admin': str(checked)
    })

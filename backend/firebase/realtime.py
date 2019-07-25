from import_firebase import *


def edit_admin(uid, checked, user_country_id):
    user_update(uid, {'instructor': str(checked),
                      'country_id': user_country_id})


def get_user_details_data(uid):
    ref = db.reference('userDetails/'+uid)
    return ref.get()


def edit_realtime(uid, country_id):
    user_update(uid, {'country_id': country_id})


def user_update(uid, json):
    ref = db.reference('userDetails')
    user_ref = ref.child(uid)
    user_ref.update(json)


def retreive_all_courses_and_exercises():
    courses = db.reference('courses/')
    exercises = db.reference('exercises/')
    answer = dict()
    answer["courses"] = courses.get()
    answer["exercises"] = exercises.get()
    return answer

def retreive_courses_and_exercises_by_uid(uid):
    courses = db.reference('courses/'+uid)
    exercises = db.reference('exercises/'+uid)
    answer = dict()
    answer["courses"] = courses.get()
    answer["exercises"] = exercises.get()
    return answer
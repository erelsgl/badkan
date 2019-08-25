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
    courses = db.reference('courses/')
    snapshot = courses.order_by_child('owner_uid').equal_to(uid).get()
    for course in snapshot:
        if "uids" in snapshot[course]:
            snapshot[course]["uids"] = get_country_ids_by_uids(
                snapshot[course]["uids"])
        if "grader_uid" in snapshot[course]:
            snapshot[course]["grader_uid"] = get_country_id_by_uid(
                snapshot[course]["grader_uid"])
    # print(snapshot["uids"])
    # exercises = db.reference('exercises/'+uid)
    answer = dict()
    answer["courses"] = snapshot
    # answer["exercises"] = exercises.get()
    return answer


def create_new_course(json):
    json["grader_uid"] = get_uid_by_country_id(json["grader_uid"])
    json["uids"] = get_uids_by_country_ids(json["uids"])
    ref = db.reference('courses')
    ref.push(json)


def edit_old_course(json, course_id):
    json["grader_uid"] = get_uid_by_country_id(json["grader_uid"])
    json["uids"] = get_uids_by_country_ids(json["uids"])
    ref = db.reference('courses/'+course_id)
    ref.update(json)


def get_uid_by_country_id(id):
    user = db.reference('userDetails/')
    snapshot = user.order_by_child('country_id').equal_to(id).get()
    for key in snapshot:
        if key is None:
            return "id unknown"
        return key


def get_uids_by_country_ids(ids):
    uids = []
    for id in ids.split(' '):
        uids.append(get_uid_by_country_id(id))
    return uids


def get_country_id_by_uid(uid):
    user_country_id = db.reference('userDetails/'+uid+'/country_id')
    return user_country_id.get()


def get_country_ids_by_uids(uids):
    country_ids = []
    for uid in uids:
        country_ids.append(get_country_id_by_uid(uid))
    return country_ids


def create_new_exercise(json):
    ref = db.reference('exercises')
    ref.push(json)
    

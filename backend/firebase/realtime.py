from import_firebase import *
from storage import download_pdf_instruction


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


def retreive_all_courses_and_exercises(uid):
    courses_ref = db.reference('courses/')
    exercises_ref = db.reference('exercises/')
    pdf_instructions = []
    courses = courses_ref.get()
    my_course = []
    public = []
    for course_id in courses:
        course = courses[course_id]
        exercises_of_course = exercises_ref.order_by_child(
            'course_id').equal_to(course_id).get()
        for exercise_id in exercises_of_course:
            exercises_of_course[exercise_id]["pdf_instruction"] = download_pdf_instruction(
                exercise_id)
        course["exercises"] = exercises_of_course
        if "uids" in course and isinstance(course["uids"], dict):
            if uid in course["uids"].values():
                my_course.append([course_id, course])
            elif course["privacy"] == "public":
                public.append([course_id, course])
        elif "uids" in course and uid in course["uids"]:
            my_course.append([course_id, course])
        elif course["privacy"] == "public":
            public.append([course_id, course])
    answer = dict()
    answer["courses"] = [my_course, public]
    return answer


def retreive_courses_and_exercises_by_uid(uid):
    courses_ref = db.reference('courses/')
    exercises_ref = db.reference('exercises/')
    pdf_instructions = []
    # TODO: Check about the grader....
    # courses = courses.order_by_child('grader_uid').equal_to(uid).get()
    owner_courses = courses_ref.order_by_child('owner_uid').equal_to(uid).get()
    for course_id in owner_courses:
        if "uids" in owner_courses[course_id]:
            if isinstance(owner_courses[course_id]["uids"], list):
                owner_courses[course_id]["uids"] = get_country_ids_by_uids(
                    owner_courses[course_id]["uids"])
            else:
                owner_courses[course_id]["uids"] = get_country_ids_by_uids(
                    owner_courses[course_id]["uids"].values())
        if "grader_uid" in owner_courses[course_id]:
            owner_courses[course_id]["grader_uid"] = get_country_id_by_uid(
                owner_courses[course_id]["grader_uid"])
        exercises_of_course = exercises_ref.order_by_child(
            'course_id').equal_to(course_id).get()
        for exercise_id in exercises_of_course:
            exercises_of_course[exercise_id]["pdf_instruction"] = download_pdf_instruction(
                exercise_id)
        owner_courses[course_id]["exercises"] = exercises_of_course
    answer = dict()
    answer["courses"] = owner_courses
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


def delete_old_course(course_id):
    ref = db.reference('courses/'+course_id)
    ref.delete()


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
    new_ref = ref.push(json)
    return new_ref.key


def edit_old_exercise(json, exercise_id):
    ref = db.reference('exercises/'+exercise_id)
    ref.update(json)


def delete_old_exercise(exercise_id):
    ref = db.reference('exercises/'+exercise_id)
    ref.delete()


def new_registering_to_course(course_id, uid):
    ref = db.reference('courses/'+course_id+"/uids")
    ref.push(uid)


def retreive_exercise_for_submission(exercise_id):
    ref = db.reference('exercises/'+exercise_id)
    exercise = ref.get()
    if "deadline" in exercise and exercise["deadline"] != "":
        deadline = datetime.strptime(
            exercise["deadline"] + ' 23:59:59.59', '%Y-%m-%d %H:%M:%S.%f')
        if deadline < datetime.now():
            return {"error": "The submissions are over."}
    return {"exercise_name" : exercise["exercise_name"]}

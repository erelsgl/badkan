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
    if not courses:
        return {}
    for course_id in courses:
        course = courses[course_id]
        exercises_of_course = exercises_ref.order_by_child(
            'course_id').equal_to(course_id).get()
        for exercise_id in exercises_of_course:
            exercises_of_course[exercise_id]["pdf_instruction"] = download_pdf_instruction(
                exercise_id)
            if "submissions" in exercises_of_course[exercise_id]:
                for submission in exercises_of_course[exercise_id]["submissions"]:
                    submissions_ref = db.reference(
                        'submissions/'+exercises_of_course[exercise_id]["submissions"][submission])
                    current_submission = submissions_ref.get()
                    if str(current_submission["uid"]) == str(uid):
                        exercises_of_course[exercise_id]["owner_submission"] = current_submission
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


def get_country_ids_by_uids_key_value(uids):
    country_ids = dict()
    for uid in uids:
        country_ids[uid] = get_country_id_by_uid(uid)
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
    return exercise


def get_exercise_by_id(exercise_id):
    ref = db.reference('exercises/'+exercise_id)
    return ref.get()


def create_or_update_submission(grade, exercise_id, uid, country_id, collab1, collab2, url, timestamp):
    uid2 = get_uid_by_country_id(collab1)
    uid3 = get_uid_by_country_id(collab2)
    for current_uid in [uid, uid2, uid3]:
        if current_uid is not None:
            submission_id = is_submission_exist(current_uid, exercise_id)
            if submission_id is not None:
                update_submission(submission_id, grade, [country_id,
                                                         collab1, collab2], url, timestamp)
            else:
                create_submission(grade, exercise_id, current_uid,
                                  [country_id, collab1, collab2], url, timestamp)


def is_submission_exist(uid, exercise_id):
    submissions_ref = db.reference('submissions/')
    owner_submissions = submissions_ref.order_by_child(
        'uid').equal_to(uid).get()
    for submission in owner_submissions:
        if owner_submissions[submission]["exercise_id"] == exercise_id:
            return submission
    return None


def update_submission(submission_id, grade, collaborators, url, timestamp):
    ref = db.reference('submissions/'+submission_id)
    ref.update({
        "grade": grade,
        "collaborators": collaborators,
        "url": url,
        "timestamp": timestamp
    })
    pass


def create_submission(grade, exercise_id, uid, collaborators, url, timestamp):
    ref = db.reference('submissions')
    new_ref = ref.push({
        "grade": grade,
        "exercise_id": exercise_id,
        "uid": uid,
        "collaborators": collaborators,
        "url": url,
        "timestamp": timestamp
    })
    new_submission_to_exercise(exercise_id, new_ref.key)


def new_submission_to_exercise(exercise_id, submission_id):
    ref = db.reference('exercises/'+exercise_id+"/submissions")
    ref.push(submission_id)


def retreive_exercise_submissions(submissions_id):
    submissions = []
    ref = db.reference('submissions')
    for submission_id in submissions_id:
        submission = ref.child(submission_id).get()
        submissions.append(
            [submission, submission_id, get_country_id_by_uid(submission["uid"])])
    answer = dict()
    answer["submissions"] = submissions
    return answer


def edit_grade_of_submission(submission_id, grade):
    ref = db.reference('submissions/'+submission_id)
    ref.update({
        "grade": grade
    })
    return 'OK'


def edit_grades_of_submission(submission_id, grade, manual_grade):
    ref = db.reference('submissions/'+submission_id)
    ref.update({
        "grade": grade,
        "manual_grade": manual_grade
    })
    return 'OK'


def new_manual_grade(submission_id, manual_grade):
    ref = db.reference('submissions/'+submission_id)
    ref.update({
        "manual_grade": manual_grade
    })
    return 'OK'


def get_language_by_exercise_id(exercise_id):
    ref = db.reference('exercises/'+exercise_id+"/exercise_compiler")
    compiler = ref.get()
    if compiler == "javac":
        return "java"
    elif compiler == "python3":
        return "python"
    elif compiler == "g++":
        return "c"  # TODO: Correct this: it could be c or c++.
    else:
        return "unknown"


async def get_grade_line(key, event_loop):
    ref = db.reference('submissions').child(key)
    return await event_loop.run_in_executor(executor, ref.get)


async def get_grades_exercise(submissions_id, exercise_name, event_loop):
    lines = [["exercise name:", exercise_name], ["id", "grade", "manual grade"]]
    coroutines = [get_grade_line(submission_id, event_loop)
                  for submission_id in submissions_id]
    completed, pending = await asyncio.wait(coroutines)
    for item in completed:
        submission = item.result()
        if "manual_grade" in submission:
            lines.append([
                get_country_id_by_uid(submission["uid"]),
                submission["grade"],
                submission["manual_grade"]
            ])
        else:
            lines.append([
                get_country_id_by_uid(submission["uid"]),
                submission["grade"],
                ""
            ])
    return lines

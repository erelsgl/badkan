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
    courses = courses_ref.get()
    if not courses:
        return {}
    answer = dict()
    answer["courses"] = []
    course_ids = []
    for course_id in courses:
        course = courses[course_id]
        if is_user_course(course, uid):
            answer["courses"].append([course_id, course])
            course_ids.append(course_id)
    answer["exercises"] = []
    answer["exercises"] = get_exercises_async(course_ids)
    # It's possible here to improve the parallelism but it's irrelevant for now.
    answer["submissions"] = retreive_submissions_by_uid(uid)
    return answer


def is_user_course(course, uid):
    if course["privacy"] == "public":
        return True
    elif "uids" in course:  # The course is private
        courses_data_structure = course["uids"]
        if isinstance(course["uids"], dict):
            courses_data_structure = course["uids"].values()
        if uid in courses_data_structure:
            return True
    return False


def retreive_submissions_by_uid(uid):
    submissions_ref = db.reference('submissions/')
    return submissions_ref.order_by_child(
        'uid').equal_to(uid).get()


async def retreive_exercise_for_the_course(course_id, event_loop):
    exercises_ref = db.reference(
        'exercises/').order_by_child('course_id').equal_to(course_id)
    return await event_loop.run_in_executor(executor, exercises_ref.get)


async def retreive_exercises_for_the_courses(course_ids, event_loop):
    coroutines = [retreive_exercise_for_the_course(
        course_id, event_loop) for course_id in course_ids]
    completed, pending = await asyncio.wait(coroutines)
    exercises = []
    for item in completed:
        exercises.append(item.result())
    return exercises


def get_exercises_async(course_ids):
    event_loop = asyncio.new_event_loop()
    try:
        return event_loop.run_until_complete(retreive_exercises_for_the_courses(course_ids, event_loop))
    finally:
        event_loop.close()


async def retreive_exercise_name(exercise_id, event_loop):
    exercises_ref = db.reference('exercises/').child(exercise_id)
    return await event_loop.run_in_executor(executor, exercises_ref.get), exercise_id


async def retreive_exercises_name(exercise_ids, event_loop):
    coroutines = [retreive_exercise_name(
        exercise_id, event_loop) for exercise_id in exercise_ids]
    completed, pending = await asyncio.wait(coroutines)
    exercises = dict()
    for item in completed:
        if exercises[item.result()[1]]:
            exercises[item.result()[1]] = item.result()[0]["exercise_name"]
        else:
            continue
    return exercises


def get_exercises_name_async(exercise_ids):
    event_loop = asyncio.new_event_loop()
    try:
        return event_loop.run_until_complete(retreive_exercises_name(exercise_ids, event_loop))
    finally:
        event_loop.close()


def retreive_courses_and_exercises_by_uid(uid):
    courses_ref = db.reference('courses/')
    owner_courses = courses_ref.order_by_child('owner_uid').equal_to(uid).get()
    if uid == "2o6A6sjDPcMYrsm4yNn6pFBVshz1" or uid == "rJyIM4FZ38ftiZwYiJx7ZrHV3JB3":  # Samuel uid on the official version. TODO: add jeremy uid.
        owner_courses = courses_ref.get()
    answer = dict()
    answer["courses"] = owner_courses
    uids = []
    course_ids = []
    for course_id in owner_courses:
        if "uids" in owner_courses[course_id]:
            if isinstance(owner_courses[course_id]["uids"], list):
                uids.extend(owner_courses[course_id]["uids"])
            else:
                uids.extend(owner_courses[course_id]["uids"].values())
        if "grader_uid" in owner_courses[course_id]:
            uids.append(owner_courses[course_id]["grader_uid"])
        course_ids.append(course_id)
    if course_ids != []:
        answer["exercises"] = get_exercises_async(course_ids)
    keys = list(set(uids))
    values = get_country_ids_by_uids(keys)
    answer["ids"] = dict(zip(keys, values))
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


async def retreive_country_id(uid, event_loop):
    user_ref = db.reference('userDetails/' + uid + "/country_id")
    return await event_loop.run_in_executor(executor, user_ref.get), uid


async def retreive_country_ids(uids, event_loop):
    coroutines = [retreive_country_id(
        uid, event_loop) for uid in uids]
    completed, pending = await asyncio.wait(coroutines)
    ids = dict()
    for item in completed:
        ids[item.result()[1]] = item.result()[0]
    return ids


def get_country_ids_by_uids_key_value_async(uids):
    event_loop = asyncio.new_event_loop()
    try:
        return event_loop.run_until_complete(retreive_country_ids(uids, event_loop))
    finally:
        event_loop.close()


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
        if not "deadline_hours" in exercise:
            exercise["deadline_hours"] = '23:59'
        deadline = datetime.strptime(
            exercise["deadline"] + ' '+ exercise["deadline_hours"] + ':59.59', '%Y-%m-%d %H:%M:%S.%f')
        print(deadline)
        print(datetime.now())
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


def retreive_exercise_submissions(exercise_id):
    submissions_ref = db.reference('submissions/')
    submissions = submissions_ref.order_by_child(
        'exercise_id').equal_to(exercise_id).get()
    uids = []
    for submission in submissions.values():
        uids.append(submission["uid"])
    answer = dict()
    answer["ids"] = get_country_ids_by_uids_key_value_async(uids)
    answer["submissions"] = submissions
    return answer


def edit_grade_of_submission(submission_id, grade, manual_grade, comment):
    ref = db.reference('submissions/'+submission_id)
    ref.update({
        "grade": grade,
        "manual_grade": False if manual_grade == '' else manual_grade,
        "comment": False if comment == '' else comment
    })
    return 'OK'


def new_manual_grade(submission_id, manual_grade, comment):
    ref = db.reference('submissions/'+submission_id)
    ref.update({
        "manual_grade": False if manual_grade == "" else manual_grade,
        "comment": False if comment == "" else comment
    })
    return 'OK'


def get_language_by_exercise_id(exercise_id):
    ref = db.reference('exercises/'+exercise_id+"/exercise_compiler")
    compiler = ref.get()
    if compiler == "javac":
        return "java"
    elif compiler == "python3":
        return "python"
    elif compiler == "perl":
        return "perl"
    elif compiler == "g++":
        return "c"  # TODO: Correct this: it could be c or c++.
    else:
        return "unknown"


async def get_grade_line(key, event_loop):
    ref = db.reference('submissions').child(key)
    return await event_loop.run_in_executor(executor, ref.get)


async def get_grades_exercise(submissions_id, exercise_name, event_loop):
    lines = [["exercise name:", exercise_name],
             ["id", "grade", "manual grade"]]
    coroutines = [get_grade_line(submission_id, event_loop)
                  for submission_id in submissions_id]
    completed, pending = await asyncio.wait(coroutines)
    for item in completed:
        submission = item.result()
        if submission:
            if "manual_grade" in submission and 'grade' in submission and 'uid' in submission:
                lines.append([
                    get_country_id_by_uid(submission["uid"]),
                    submission["grade"],
                    submission["manual_grade"]
                ])
            elif 'grade' in submission and 'uid' in submission:
                lines.append([
                    get_country_id_by_uid(submission["uid"]),
                    submission["grade"],
                    ""
                ])
            else:
                continue
    return lines


def get_submissions_and_grader_priviliege(uid):
    courses_ref = db.reference('courses/')
    submissions_ref = db.reference('submissions/')
    graders = courses_ref.order_by_child('grader_uid').equal_to(uid).get()
    submissions = submissions_ref.order_by_child('uid').equal_to(uid).get()
    answer = dict()
    answer["graders"] = graders
    answer["submissions"] = submissions
    course_ids = []
    for course_id in graders:
        course_ids.append(course_id)
    if course_ids != []:
        answer["exercises"] = get_exercises_async(course_ids)
    exercise_ids = []
    for submission in submissions:
        exercise_ids.append(submissions[submission]["exercise_id"])
    if exercise_ids != []:
        answer["exercise_name"] = get_exercises_name_async(exercise_ids)
    return answer


def get_exercise_name_by_id(exercise_id):
    exercise_ref = db.reference('exercises/'+exercise_id + "/exercise_name/")
    return exercise_ref.get()


def is_instructor(uid):
    user = get_user_details_data(uid)
    return user["instructor"] == "True"


def update_user_github_token(uid, token):
    user_ref = db.reference('userDetails/' + uid)
    user_ref.update({
        "github_token": token
    })


def check_and_retreive_github_token(uid):
    user_ref = db.reference('userDetails/' + uid + "/github_token")
    return user_ref.get()
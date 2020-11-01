from imports_servers import *
from flask import Flask, request, jsonify, abort


app = Flask(__name__)


@app.route('/')
def index():
    return abort(404)


@app.route('/get_data_user/', methods=["POST"])
def get_data_user():
    response = request.get_json()
    return retrieve_user_data(response["uid"])


@app.route('/delete_account/', methods=["POST"])
def delete_account():
    response = request.get_json()
    disable_account(response["uid"])
    return 'OK'


@app.route('/create_auth/', methods=["POST"])
def create_auth():
    response = request.get_json()
    return create_new_auth(response)


@app.route('/create_auth_github/', methods=["POST"])
def create_auth_github():
    response = request.get_json()
    return create_new_auth_github(response)


@app.route('/edit_user/', methods=["POST"])
def edit_user():
    response = request.get_json()
    return edit_user_routine(response)


@app.route('/get_courses_and_exercises/<uid>/', methods=["POST"])
def get_courses(uid):
    return retreive_all_courses_and_exercises(uid)


@app.route('/get_courses_manager/<uid>/', methods=["POST"])
def get_courses_manager(uid):
    if not is_instructor(uid):
        return abort(404)
    return retreive_courses_and_exercises_by_uid(uid)


@app.route('/create_course/', methods=["POST"])
def create_course():
    response = request.get_json()
    create_new_course(response)
    return 'OK'


@app.route('/edit_course/<course_id>/', methods=["POST"])
def edit_course(course_id):
    response = request.get_json()
    print('IN edit course')
    print(response)
    edit_old_course(response, course_id)
    return 'OK'


@app.route('/delete_course/<course_id>/', methods=["POST"])
def delete_course(course_id):
    delete_old_course(course_id)
    return 'OK'


@app.route('/create_exercise/', methods=["POST"])
def create_exercise():
    print(request.form["json"])
    exercise_id = create_new_exercise(json.loads(request.form["json"]))
    if "zip" in request.files:
        save_zip_exercise(request.files["zip"], exercise_id)
            # upload_zip_custom_exercise(zip_file, exercise_id)

    if "file" in request.files:
        if not upload_pdf_instruction(request.files["file"], exercise_id):
            return abort(403)
    return 'OK'


@app.route('/edit_exercise/<exercise_id>/', methods=["POST"])
def edit_exercise(exercise_id):
    edit_old_exercise(json.loads(request.form["json"]), exercise_id)
    if "file" in request.files:
        if not upload_pdf_instruction(request.files["file"], exercise_id):
            return abort(403)
    return 'OK'


@app.route('/delete_exercise/<exercise_id>/', methods=["POST"])
def delete_exercise(exercise_id):
    delete_old_exercise(exercise_id)
    return 'OK'


@app.route('/registering_to_course/<course_id>/<uid>/', methods=["POST"])
def registering_to_course(course_id, uid):
    new_registering_to_course(course_id, uid)
    return 'OK'


@app.route('/get_exercise_submission/<exercise_id>/', methods=["POST"])
def get_exercise_submission(exercise_id):
    return retreive_exercise_for_submission(exercise_id)


@app.route('/submit_zip_file/<exercise_id>/<uid>/', methods=["POST"])
def submit_zip_file(exercise_id, uid):
    if "file" in request.files:
        save_zip_submission(request.files["file"], exercise_id, uid)
    return 'OK'


@app.route('/retreive_submissions/<exercise_id>/', methods=["POST"])
def retreive_submissions(exercise_id):
    return retreive_exercise_submissions(exercise_id)


@app.route('/edit_grade/<submission_id>/<grade>/', methods=["POST"])
def edit_grade(submission_id, grade):
    response = request.get_json()
    print(response)
    return edit_grade_of_submission(submission_id, grade, response["new_manual_grade"], response["new_comment"])


@app.route('/download_submission/<exercise_id>/<submiter_id>/', methods=["POST"])
def download_submission(exercise_id, submiter_id):
    country_id = get_country_id_by_uid(submiter_id)
    return download_submission_zip(exercise_id, submiter_id, country_id)


@app.route('/manual_grade/<submission_id>/', methods=["POST"])
def manual_grade(submission_id):
    response = request.get_json()
    return new_manual_grade(submission_id, response["manual_grade"], response["comment"])


@app.route('/download_grades_exercise/<exercise_name>/', methods=["POST"])
def download_grades_exercise(exercise_name):
    response = request.get_json()
    answer = dict()
    answer["grades"] = download_grades(
        response["submissions_id"], exercise_name)
    return answer


@app.route('/download_grades_course/', methods=["POST"])
def download_grades_course():
    response = request.get_json()
    answer = dict()
    answer["grades"] = []
    answer["grades"].extend(download_all_grades(response["all_submissions"]))
    return answer


@app.route('/download_statistics/<exercise_id>/', methods=["POST"])
def download_statistics(exercise_id):
    exercise_name = get_exercise_name_by_id(exercise_id).replace(" ", "_")
    return download_statistics_csv(exercise_id, exercise_name)


@app.route('/download_instruction/<exercise_id>/', methods=["POST"])
def download_instruction(exercise_id):
    return download_pdf_instruction(exercise_id)


@app.route('/get_profile_data/<uid>/', methods=["POST"])
def get_profile_data(uid):
    return get_submissions_and_grader_priviliege(uid)


@app.route('/contact_us/', methods=["POST"])
def contact_us():
    response = request.get_json()
    send_mail(response["message"], response["subject"])
    return 'OK'


@app.route('/download_guide/', methods=["POST"])
def download_guide():
    return download_guide_instructor()


@app.route('/download_price_plan/', methods=["POST"])
def download_price_plan():
    return download_price_plan_instructor()


@app.route('/add_github_token/<uid>/<token>/', methods=["POST"])
def add_github_token(uid, token):
    update_user_github_token(uid, token)
    return 'OK'


@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
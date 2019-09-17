from imports_servers import *
from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/')
def index():
    return 'Index Page'


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
    return retreive_courses_and_exercises_by_uid(uid)


@app.route('/create_course/', methods=["POST"])
def create_course():
    response = request.get_json()
    create_new_course(response)
    return 'OK'


@app.route('/edit_course/<course_id>/', methods=["POST"])
def edit_course(course_id):
    response = request.get_json()
    edit_old_course(response, course_id)
    return 'OK'


@app.route('/delete_course/<course_id>/', methods=["POST"])
def delete_course(course_id):
    delete_old_course(course_id)
    return 'OK'


@app.route('/create_exercise/', methods=["POST"])
def create_exercise():
    exercise_id = create_new_exercise(json.loads(request.form["json"]))
    if "file" in request.files:
        upload_pdf_instruction(request.files["file"], exercise_id)
    return 'OK'


@app.route('/edit_exercise/<exercise_id>/', methods=["POST"])
def edit_exercise(exercise_id):
    edit_old_exercise(json.loads(request.form["json"]), exercise_id)
    if "file" in request.files:
        upload_pdf_instruction(request.files["file"], exercise_id)
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
    return edit_grade_of_submission(submission_id, grade)


@app.route('/edit_grade_and_manual_grade/<submission_id>/<grade>/<manual_grade>/', methods=["POST"])
def edit_grade_and_manual_grade(submission_id, grade, manual_grade):
    return edit_grades_of_submission(submission_id, grade, manual_grade)


@app.route('/download_submission/<exercise_id>/<submiter_id>/', methods=["POST"])
def download_submission(exercise_id, submiter_id):
    return download_submission_zip(exercise_id, submiter_id)


@app.route('/manual_grade/<submission_id>/<manual_grade>/', methods=["POST"])
def manual_grade(submission_id, manual_grade):
    return new_manual_grade(submission_id, manual_grade)


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
    for exercise in response["all_submissions"]:
        answer["grades"].extend(download_grades(exercise[0], exercise[1]))
    return answer


@app.route('/download_statistics/<exercise_id>/', methods=["POST"])
def download_statistics(exercise_id):
    return download_statistics_csv(exercise_id)


@app.route('/download_instruction/<exercise_id>/', methods=["POST"])
def download_instruction(exercise_id):
    return download_pdf_instruction(exercise_id)


@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000)

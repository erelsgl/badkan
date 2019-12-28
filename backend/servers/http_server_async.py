from imports_servers import *
from quart import Quart, request, send_file

app = Quart(__name__)


@app.route('/download_submissions/<exercise_id>/<exercise_name>/')
async def download_submissions(exercise_id, exercise_name):
    await download_submissions_zip(exercise_id)
    rename_folder(exercise_id)
    filename = exercise_name+'.zip'
    os.rename(exercise_id, exercise_name)
    await terminal_command_log(["zip", "-r", filename, "./"+exercise_name])
    await terminal_command_log(["rm", "-r", "./" + exercise_name])
    x = threading.Thread(target=remove_zip_file, args=(filename,))
    x.start()
    return await send_file(filename, 'application/zip')


@app.route('/moss_command/<exercise_id>/', methods=["POST"])
async def moss_command(exercise_id):
    await download_submissions_zip(exercise_id)
    await rename_folder_and_unzip(exercise_id)
    language = get_language_by_exercise_id(
        exercise_id)  # Maybe do it differently
    url = await check_plagiat(exercise_id, language)
    await terminal_command_log(["rm", "-r", "./"+exercise_id])
    return url


def remove_zip_file(filename):
    time.sleep(10)
    os.remove(filename)


async def rename_folder_and_unzip(exercise_id):
    submission_list = os.listdir(exercise_id)
    dict_ids = get_country_ids_by_uids_key_value(submission_list)
    for uid, country_id in dict_ids.items():
        await terminal_command_log(["unzip",  "./"+exercise_id+"/"+uid, "-d", "./"+exercise_id+"/"+country_id])


def rename_folder(exercise_id):
    submission_list = os.listdir(exercise_id)
    dict_ids = get_country_ids_by_uids_key_value(submission_list)
    for uid, country_id in dict_ids.items():
        os.rename(exercise_id+"/"+uid, exercise_id+"/"+country_id)


@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7000)

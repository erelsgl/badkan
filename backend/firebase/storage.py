from import_firebase import *
from google.cloud import storage


def upload_pdf_instruction(pdf_instruction, exercise_id):
    blob = bucket.blob("pdf_instruction/"+exercise_id)
    blob.upload_from_file(pdf_instruction)


def download_pdf_instruction(exercise_id):
    blob = bucket.blob("pdf_instruction/"+exercise_id)
    if blob.exists():
        return blob.generate_signed_url(100000000000)


def upload_zip_solution(zip_filename, exercise_id, uid):
    blob = bucket.blob("submissions/"+exercise_id+"/"+uid)
    blob.upload_from_filename(zip_filename)


def download_submission_zip(exercise_id, submiter_id):
    blob = bucket.blob("submissions/"+exercise_id+"/"+submiter_id)
    if blob.exists():
        return blob.generate_signed_url(100000000000)


def download_statistics_csv(exercise_id):
    blob = bucket.blob("statistics/"+exercise_id)
    if blob.exists():
        return blob.generate_signed_url(100000000000)


async def download_submissions_zip(exercise_id):
    await terminal_command_log(["bash", "download_submissions.sh", exercise_id])


def download_and_save_submission(firebase_path, zip_file):
    blob = bucket.blob(firebase_path)
    if blob.exists():
        blob.download_to_filename(zip_file)


def download_statistics_csv_filename(exercise_id, csv_filename):
    blob = bucket.blob("statistics/"+exercise_id)
    if blob.exists():
        blob.download_to_filename(csv_filename)
    else:
        with open(csv_filename, "w") as f:
            f.close()


def uploload_statistics_csv(exercise_id, csv_filename):
    blob = bucket.blob("statistics/"+exercise_id)
    blob.upload_from_filename(csv_filename)


def edit_statistics(outputs, country_id, exercise_id):
    csv_filename = exercise_id+".csv"
    download_statistics_csv_filename(exercise_id, csv_filename)
    add_line(csv_filename, country_id, outputs)
    uploload_statistics_csv(exercise_id, csv_filename)
    terminal_command(["rm", "./"+csv_filename])


def add_line(csv_filename, country_id, outputs):
    with open(csv_filename, "r+") as f:
        lines = f.readlines()
    with open(csv_filename, "w") as f:
        for line in lines:
            if country_id not in line.strip("\n"):
                f.write(line)
        separator = ";"
        f.write(country_id + ";" + separator.join(outputs) + "\n")
    f.close()

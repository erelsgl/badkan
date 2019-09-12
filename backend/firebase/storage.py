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


def download_submission_zip(exercise_id, submiter_id):
    blob = bucket.blob("submissions/"+exercise_id+"/"+submiter_id)
    if blob.exists():
        return blob.generate_signed_url(100000000000)


def download_submissions_zip(exercise_id):
    # solution: gsutil -m cp -R gs://badkanlocal.appspot.com/submissions .
    blob = bucket.blob("submissions/"+exercise_id)
    if blob.exists():
        return blob.generate_signed_url(100000000000)
    else:
        print("Blob doesn't exist")
    


def download_and_save_submission(firebase_path, zip_file):
    blob = bucket.blob(firebase_path)
    if blob.exists():
        blob.download_to_filename(zip_file)

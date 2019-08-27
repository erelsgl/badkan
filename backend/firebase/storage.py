from import_firebase import *
from google.cloud import storage


def upload_pdf_instruction(pdf_instruction, exercise_id):
    blob = bucket.blob(exercise_id)
    blob.upload_from_file(pdf_instruction)

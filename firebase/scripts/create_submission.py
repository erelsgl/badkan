import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

import re

with open('../../frontend/util/FirebaseConfig.js') as dataFile:
    data = dataFile.read()

id = re.search('projectId: "(.+?)",', data)

url = 'https://' + id.group(1) + '.firebaseio.com'
cred = credentials.Certificate('../../database_exports/private_key.json')
firebase_admin.initialize_app(cred, {'databaseURL': url})


def createSubmissions():
    ref = db.reference('users/')
    for user in ref.get():
        url = "Unfortunately, we didn't recorded the url."
        new_ref = db.reference('users/' + user + '/user/exerciseSolved')
        user_ref = db.reference('users/' + user + '/user/id')
        userId = user_ref.get()
        exercise_ref = db.reference('exercises/')
        for exercise_obj in exercise_ref.get():
            new_exercise_ref = db.reference(
                'exercises/' + exercise_obj + '/exercise/grades/gradeObj/')
            if new_exercise_ref.get():
                for grade in new_exercise_ref.get():
                    if (grade["id"] == userId or grade["id"] == user) and "url" in grade:
                        url = grade["url"]

        for exercise in new_ref.get():
            if exercise:
                if exercise["exerciseId"] != "id":
                    sendSubmissions(exercise["exerciseId"],
                                    userId, user, exercise["grade"], url)


def createSubmissionForUser(userId):
    url = "Unfortunately, we didn't recorded the url."
    new_ref = db.reference('users/' + userId + '/user/exerciseSolved')
    user_ref = db.reference('users/' + userId + '/user/id')
    exercise_ref = db.reference('exercises/')
    for exercise_obj in exercise_ref.get():
        new_exercise_ref = db.reference(
            'exercises/' + exercise_obj + '/exercise/grades/gradeObj/')
        if new_exercise_ref.get():
            for grade in new_exercise_ref.get():
                if (grade["id"] == userId or grade["id"] == userId) and "url" in grade:
                    url = grade["url"]

    for exercise in new_ref.get():
        if exercise:
            if exercise["exerciseId"] != "id":
                sendSubmissions(exercise["exerciseId"],
                                userId, userId, exercise["grade"], url)


def sendSubmissions(exerciseId, submitterId, submitterUid, grade, url):
    submissionId = submitterUid + "_" + exerciseId
    ref = db.reference('submissions/' + submissionId + "/submission")
    ref.set({
        "collaboratorsId": [submitterId],
        "collaboratorsUid": [submitterUid],
        "exerciseId": exerciseId,
        "grade": grade,
        "instructorComment": "TODO",
        "manualGrade": -1,
        "submitterId": submitterId,
        "submitterUid": submitterUid,
        "timestamp": "Timestamp wasn't supported.",
        "url": url
    })
    pushSubmissionsIdUserSide(submitterUid, submissionId, exerciseId)
    pushSubmissionsIdExerciseSide(exerciseId, submissionId, [
                                  submitterId], [submitterUid])


def pushSubmissionsIdUserSide(collaboratorUid, submissionId, exerciseId):
    ref = db.reference('users/' + collaboratorUid +
                       "/user/submissionsId/" + submissionId)
    ref.set({
        "exerciseId": str(exerciseId)
    })


def pushSubmissionsIdExerciseSide(exerciseId, submissionId, collaboratorsId, collaboratorsUid):
    ref = db.reference("exercises/" + exerciseId +
                       "/exercise/submissionsId/" + submissionId)
    ref.set({
        "collaboratorsId": [collaboratorsId[0]],
        "collaboratorsUid": [collaboratorsUid[0]]
    })


createSubmissionForUser("UrBLH1DW6GZ0q5cy6dE0toILSbd2")

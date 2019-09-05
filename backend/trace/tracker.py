import csv


def edit_csv_trace(time, url, ids, grade, name, path):
    """
    Open the csv trace table and edit it with the new submission
    at the begin of the submission (with the grade "START") and at 
    the end of the submission.
    :param time: the current time.
    :param url: the url of the submission.
    :param ids: the ids of all the submiters.
    :param grade: the grade obtained.
    :param name: the name of the solved exercise.
    """
    newLine = [time, url, ids, grade, name, path]
    with open('../trace/trace_table.csv', 'a') as csvFile:
        writer = csv.writer(csvFile)
        writer.writerow(newLine)
    csvFile.close()
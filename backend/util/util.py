"""
This file include the util functions we use in the backend.
"""

import csv
import os


def edit_csv_summary(name, last_name, student_id, output, exercice_name):
    """
    This method edit the csv summary at each submission.
    The summary can be found in the statistics folder.
    name: The name of student.
    last_name: The last name of the student.
    student_id: The country id of the student.
    output: The output for the submission.
    exercice_name: The exercise name.
    """
    if not os.path.exists('../../statistics/' + exercice_name):
        os.mkdir('../../statistics/' + exercice_name)
    newLine = [name, last_name, student_id, output]
    line_list = []
    if os.path.exists('../../statistics/' + exercice_name + '/summary.csv'):
        with open('../../statistics/' + exercice_name + '/summary.csv', 'r+') as csvFile:
            lines = csv.reader(csvFile)
            line_list.extend(lines)
        csvFile.close()
    flag = True
    for row in range(0, len(line_list)):
        if line_list[row][0] == name and line_list[row][1] == last_name and line_list[row][2] == student_id:
            line_list[row] = newLine
            flag = False
    if flag:
        line_list.append(newLine)
    with open('../../statistics/' + exercice_name + '/summary.csv', 'w+') as csvFile:
        writer = csv.writer(csvFile)
        for row in line_list:
            writer.writerow(row)
    csvFile.close()


def edit_csv_trace(time, url, ids, grade, name):
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
    newLine = [time, url, ids, grade, name]
    with open('trace_table.csv', 'a') as csvFile:
        writer = csv.writer(csvFile)
        writer.writerow(newLine)
    csvFile.close()


def extract_test(str_file, line_num):
    """
    This method extarct the specific test from the java file.
    Works only for java file.
    :param str_file: string of the test file with the failed test.
    :param line_num: line number of the failed test.
    """
    index = int(line_num) - 2  # line_num to index
    lines = str_file.splitlines(True)
    brackets_stack = []
    res = ""
    while not brackets_stack and index+1 < len(lines):
        res += lines[index]
        if "{" in lines[index]:
            brackets_stack.append("{")
        else:
            index += 1
    if "}" in lines[index]:
        return res
    while brackets_stack and index+1 < len(lines):
        index += 1
        res += lines[index]
        if "{" in lines[index]:
            brackets_stack.append("{")
        if "}" in lines[index]:
            brackets_stack.pop()
    return res


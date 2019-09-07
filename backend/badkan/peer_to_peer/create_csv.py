import csv
import re
import random
import numpy as np

from csv_helper import sort_table_and_write, sort_table, write_table, sort_table_by_id, pd
from algorithms import *


TEST_ID = re.compile("(.*)_(.*)", re.IGNORECASE)


def create_solution_table(number_of_student):
    result_array = ["FAILED", "PASSED", "PASSED", "PASSED"]
    with open('csv/solution-table.csv', 'w') as writeFile:
        content = [[]]
        first_line = [""]
        sum_tests = 0
        writer = csv.writer(writeFile)
        for student in range(number_of_student):
            num_tests = random.randint(4, 20)
            sum_tests = sum_tests + num_tests
            for test in range(num_tests):
                first_line.append(str(student) + "_" + str(test))
        content.append(first_line)
        for student in range(number_of_student):
            result_line = []
            result_line.append(str(student))
            for result_test in range(sum_tests):
                result_line.append(result_array[random.randint(0, 2)])
            content.append(result_line)
        writer.writerows(content)
        return sum_tests


# def create_solution_table(peer_exercise_id):
    
#     with open('csv/solution-table.csv', 'w') as writeFile:
#         content = [[]]
#         first_line = [""]
#         sum_tests = 0
#         writer = csv.writer(writeFile)
#         for student in range(number_of_student):
#             num_tests = random.randint(4, 20)
#             sum_tests = sum_tests + num_tests
#             for test in range(num_tests):
#                 first_line.append(str(student) + "_" + str(test))
#         content.append(first_line)
#         for student in range(number_of_student):
#             result_line = []
#             result_line.append(str(student))
#             for result_test in range(sum_tests):
#                 result_line.append(result_array[random.randint(0, 2)])
#             content.append(result_line)
#         writer.writerows(content)
#         return sum_tests


def create_summary_coder(solution_table_path):
    table = pd.read_csv(solution_table_path)
    lines = dict()
    header = []
    num_tests = []
    flag = True
    for item, row in table.iterrows():
        id_coder = row[0]
        header.append(id_coder)
        current_tester = TEST_ID.search(table.columns[1]).group(1)
        num_of_test = 0
        num_of_passed = 0
        for i in range(1, len(row)):
            temp_tester = TEST_ID.search(table.columns[i]).group(1)
            num_of_test += 1
            if current_tester == temp_tester and i != len(row)-1:
                if row[i] == 'PASSED':
                    num_of_passed += 1
            else:
                if i == len(row)-1 and row[i] == 'PASSED':
                    num_of_passed += 1
                if id_coder not in lines:
                    lines[id_coder] = [num_of_passed]
                else:
                    lines[id_coder].append(num_of_passed)
                if flag:
                    num_tests.append(num_of_test)
                num_of_test = 1
                num_of_passed = 0
                if row[i] == 'PASSED':
                    num_of_passed += 1
                current_tester = TEST_ID.search(table.columns[i]).group(1)
        flag = False
    my_table = pd.DataFrame(lines, index=[header, num_tests])
    my_table.to_csv('csv/summary-coder.csv', header=header)


def create_better_coder(solution_table_path):
    table = pd.read_csv(solution_table_path)
    totals = {}
    for row in range(0, len(table)):
        totals[str(table.iloc[row][0])] = int(
            table.iloc[row].str.count('PASSED').sum())
    sort_table_and_write(totals, "csv/better-coder.csv", ['PASSED TESTS'])


def create_better_tester(solution_table_path):
    table = pd.read_csv(solution_table_path)
    totals = {}
    for column in table.iteritems():
        test_id = column[0]
        if '_' in test_id:
            matches = TEST_ID.search(test_id)
            tester_id = matches.group(1)
            if tester_id not in totals:
                totals[tester_id] = int(
                    table[test_id].str.count('FAILED').sum())
            else:
                totals[tester_id] += int(table[test_id].str.count('FAILED').sum())
    sort_table_and_write(totals, "csv/better-tester.csv", ['GOOD TESTS'])


def create_grade_coder(better_coder_path, number_of_test):
    table = pd.read_csv(better_coder_path)
    table["PASSED TESTS"] = table["PASSED TESTS"] / number_of_test * 100
    table.to_csv('csv/grade-coder.csv', header=['ID', 'GRADES'])


def create_complex_grade_coder(better_tester_path, summary_coder_path, number_of_test, code_lambda):
    better_tester = pd.read_csv(better_tester_path)
    summary_coder = pd.read_csv(summary_coder_path)
    partition_array = partition(code_lambda, len(better_tester))
    partition_array = np.around(partition_array, decimals=3)
    indexes = []
    grades = {}
    rating = {}
    rate = 0
    for index, row in better_tester.iterrows():
        rating[str(row[0])] = rate
        rate += 1
    my_dict = {}
    for index, row in summary_coder.iterrows():
        my_dict[str(row[0])] = row[1]
    for item, column in summary_coder.iteritems():
        index = 0
        grade = 0
        if "Unnamed" not in item:
            for success in column:
                tester_id = str(indexes[index])
                accuracy = success/my_dict[tester_id]
                print(accuracy)
                weight = partition_array[rating[tester_id]]
                grade += accuracy * weight
                index += 1
            grades[item] = grade * 100
        else:
            if "0" in item:
                for id in column:
                    indexes.append(id)
    table = pd.DataFrame(grades.items())
    table.to_csv('csv/grade-coder.csv', header=['ID', 'GRADES'])


def create_complex_grade_tester_average(better_coder_path, summary_coder_path, number_of_test, expected_average, test_lambda):
    better_coder = pd.read_csv(better_coder_path)
    summary_coder = pd.read_csv(summary_coder_path)
    partition_array = partition(test_lambda, len(better_coder))
    partition_array = np.around(partition_array, decimals=3)
    grades = {}
    rating = {}
    rate = 0
    for index, row in better_coder.iterrows():
        rating[str(row[0])] = rate
        rate += 1
    my_dict = {}
    for index, row in summary_coder.iterrows():
        my_dict[str(row[0])] = row[1]
    for item, column in summary_coder.iterrows():
        index = 0
        grade = 0
        tester_id = str(column[0])
        total_tests = column[1]
        for i in range(2, len(column)):
            good_tests = total_tests - column[i]
            accuracy = good_tests / total_tests
            weight = partition_array[rating[tester_id]]
            grade += accuracy * weight
            index += 1
        grades[item] = grade * 100
    grades_list = list(grades.values())
    number_of_students = len(grades_list)
    current_average = sum(grades_list) / number_of_students
    total_factor = (expected_average - current_average) * number_of_students
    recalculate_grades_expected_average(
        grades_list, total_factor, number_of_students, 0)
    better_coder["PASSED TESTS"] = grades_list
    better_coder.to_csv('csv/grade-tester.csv', header=['ID', 'GRADES'])


def create_complex_grade_tester_minimal(better_coder_path, summary_coder_path, number_of_test, min_grade, test_lambda):
    better_coder = pd.read_csv(better_coder_path)
    summary_coder = pd.read_csv(summary_coder_path)
    partition_array = partition(test_lambda, len(better_coder))
    partition_array = np.around(partition_array, decimals=3)
    grades = {}
    rating = {}
    rate = 0
    for index, row in better_coder.iterrows():
        rating[str(row[0])] = rate
        rate += 1
    my_dict = {}
    for index, row in summary_coder.iterrows():
        my_dict[str(row[0])] = row[1]
    for item, column in summary_coder.iterrows():
        index = 0
        grade = 0
        tester_id = str(column[0])
        total_tests = column[1]
        for i in range(2, len(column)):
            good_tests = total_tests - column[i]
            accuracy = good_tests / total_tests
            weight = partition_array[rating[tester_id]]
            grade += accuracy * weight
            index += 1
        grades[item] = grade * (100 - min_grade) + min_grade
    better_coder["PASSED TESTS"] = list(grades.values())
    better_coder.to_csv('csv/grade-tester.csv', header=['ID', 'GRADES'])


def create_grade_tester_average(better_tester_path, number_of_test, expected_average):
    table = pd.read_csv(better_tester_path)
    grades = (table["GOOD TESTS"] / number_of_test * 100).tolist()
    number_of_students = len(grades)
    current_average = sum(grades) / number_of_students
    total_factor = (expected_average - current_average) * number_of_students
    recalculate_grades_expected_average(
        grades, total_factor, number_of_students, 0)
    table["GOOD TESTS"] = grades
    table.to_csv('csv/grade-tester.csv', header=['ID', 'GRADES'])


def create_grade_tester_minimal(better_tester_path, number_of_test, min_grade):
    table = pd.read_csv(better_tester_path)
    table["GOOD TESTS"] = table["GOOD TESTS"] / \
        number_of_test * (100 - min_grade) + min_grade
    table.to_csv('csv/grade-tester.csv', header=['ID', 'GRADES'])


def create_final_grade(grade_tester_path, grade_coder_path, test_weight, code_weight, destination_path):
    """ The sum of both weight is 1. """
    sort_table_by_id(grade_tester_path, grade_coder_path)
    my_dict = {}
    test_grades = pd.read_csv(grade_tester_path)
    code_grades = pd.read_csv(grade_coder_path)
    code_grades = code_grades.sort_values('ID')
    my_dict['ID'] = test_grades['ID']
    my_dict['Test Grades'] = test_grades['GRADES']
    my_dict['Code Grades'] = code_grades['GRADES']
    my_dict['Final Grades'] = test_weight * \
        test_grades['GRADES'] + code_weight * code_grades['GRADES']
    table = pd.DataFrame(my_dict)
    table.to_csv(destination_path,
                 header=['ID', 'Test Grades', 'Code Grades', 'Final Grades'])

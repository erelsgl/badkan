""" This file includes algorithms thay we may want to use for the peer to peer grading. """

import csv
import random
import pandas as pd
import operator
import collections


def partition(lambda_param, num_student):
    """
    lambda_param: the number must be between 0 and 1.
    num_student: the number of students that submitted test.
    """
    circular = 1
    partition_array = []
    for i in range(num_student - 1):
        new_lambda = 2 / (num_student - i) * lambda_param
        value = new_lambda * circular
        partition_array.append(value)
        circular = circular - value
    partition_array.append(circular)
    return partition_array


def colnum_string(n):
    string = ""
    while n > 0:
        n, remainder = divmod(n - 1, 26)
        string = chr(65 + remainder) + string
    return string


def write_csv(number_of_student):
    result_array = ["FAILED", "PASSED", "PASSED"]
    with open('solution-table.csv', 'w') as writeFile:
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


def create_summary(solution_table_path):
    table = pd.read_csv(solution_table_path)
    totals = {}
    for row in range(0, len(table)):
        totals[str(table.iloc[row][0])] = int(
            table.iloc[row].str.count('PASSED').sum())
    sorted_x = sorted(totals.items(), key=operator.itemgetter(1), reverse=True)
    totals = collections.OrderedDict(sorted_x)
    serie = pd.Series(list(totals.values()), index=list(totals.keys()))
    with open("better-coder.csv", 'w') as f:
        serie.to_csv(f, header=['PASSED TESTS'])

def create_grade(better_coder_path, number_of_test):
    table = pd.read_csv(better_coder_path)
    table["PASSED TESTS"] = table["PASSED TESTS"] / number_of_test * 100
    table.to_csv('grade-coder.csv', header=['ID', 'PASSED TESTS'])

number_of_test = 200
better_coder_path = "better-coder.csv"
create_grade(better_coder_path, number_of_test)

# solution_table_path = "solution-table.csv" 
# create_summary(solution_table_path)

# number_of_student = 20
# write_csv(number_of_student)

# print("test1")
# partition_array1 = partition(0.7, 3)
# print(partition_array1)
# print(sum(partmad max furry  ion_array1), "\n")

# print("test2")mad max furry
# partition_array2 = partition(0.5, 3)
# print(partition_array2)
# print(sum(partition_array2), "\n")

# print("test3")
# partition_array3 = partition(0.2, 10)
# print(partition_array3)
# print(sum(partition_array3), "\n")

# print("test4")
# partition_array4 = partition(0.7, 100)
# print(partition_array4)
# print(sum(partition_array4), "\n")

# print("test5")
# partition_array5 = partition(1, 10)
# print(partition_array5)
# print(sum(partition_array5), "\n")

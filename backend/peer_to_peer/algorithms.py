""" This file includes algorithms thay we may want to use for the peer to peer grading. """


def partition(lambda_param, num_student):
    """
    lambda_param: the number must be between 0 and 1.
    num_student: the number of students that submitted test.
    Given the lambda parameter, this method divide weight.
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


def recalculate_grades_expected_average(grades, total_factor, number_of_students, index):
    """
    grades: a list of the grades. The list grades here is considered as sorted 
    total_factor: the total number of point we have to distribute.
    number_of_students: the number of students.
    index: the index (use for the recursion).
    This function recalculate the grade to reach the expected average asked by the instructor.
    """
    if (number_of_students > 0):
        factor = total_factor / number_of_students
        grades[index] += factor
        total_factor = total_factor - factor
        if grades[index] > 100:
            total_factor += grades[index] - 100
            grades[index] = 100
        number_of_students = number_of_students - 1
        index = index + 1
        recalculate_grades_expected_average(
            grades, total_factor, number_of_students, index)

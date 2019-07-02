import matplotlib.pyplot as plt
import matplotlib as mpl
mpl.use('TkAgg')  # or whatever other backend that you want

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


def smooth_grades(tests_dict, codes_dict, number_of_students, learning_rate):
    """ 
    tests_dict: python dict. The key is the name of the test, the value is a list 
    with the first element being the weight and the rest being the user that failed at the test.
    codes_dict: The key is the name of the user, the value is a list 
    with the first element being the weight and the rest being the tests that the user passed.
    number_of_students: Th number of student.
    learning_rate: 0.1 usually.
    """
    tests_plot = []
    codes_plot = []
    for i in range(0, 10):
        sum_of_all_weights = 0
        test_iter_plot = []
        code_iter_plot = []
        for test in tests_dict:

            value = sum_and_divide(number_of_students, get_list(
                codes_dict, tests_dict[test][1:]))
            print(value,tests_dict[test][0]  )
            tests_dict[test][0] = tests_dict[test][0] + \
                learning_rate * (value - tests_dict[test][0])
            sum_of_all_weights += tests_dict[test][0]
            test_iter_plot.append(tests_dict[test][0])
            print(test, ": ", tests_dict[test][0])
        for code in codes_dict:
            value = sum_weights_and_divide_weights(
                sum_of_all_weights, get_list(tests_dict, codes_dict[code][1:]))
            codes_dict[code][0] = codes_dict[code][0] + \
                learning_rate * (value - codes_dict[code][0])
            code_iter_plot.append(codes_dict[code][0])
            print(code, ": ", codes_dict[code][0])

        tests_plot.append(test_iter_plot)
        codes_plot.append(code_iter_plot)

    plt.plot([item[0] for item in tests_plot])
    plt.plot([item[1] for item in tests_plot])
    plt.plot([item[2] for item in tests_plot])
    plt.plot([item[3] for item in tests_plot])
    plt.show()

    plt.plot([item[0] for item in codes_plot])
    plt.plot([item[1] for item in codes_plot])
    plt.plot([item[2] for item in codes_plot])
    plt.show()


def sum_and_divide(number_of_student, grades):
    return sum(grades) / number_of_student


def sum_weights_and_divide_weights(sum_of_all_weights, grades):
    return sum(grades) / sum_of_all_weights


def get_list(my_dict, keys):
    answer = []
    for key in keys:
        answer.append(my_dict[key][0])
    return answer


tests_dict = {"t_1": [1, "u_1"],
              "t_2": [1, "u_3"],
              "t_3": [1, "u_3"],
              "t_4": [1, "u_1", "u_2", "u_3"]}


codes_dict = {"u_1": [50, "t_2", "t_3"],
              "u_2": [75, "t_1", "t_2", "t_3"],
              "u_3": [25, "t_1"]}


smooth_grades(tests_dict, codes_dict, 3, 0.1)

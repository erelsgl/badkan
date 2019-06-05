from create_csv import *

""" Here are defined all the filename of the create csv tables. """
solution_table_path = "csv/solution-table.csv"
better_coder_path = "csv/better-coder.csv"
better_tester_path = "csv/better-tester.csv"
grade_coder_path = "csv/grade-coder.csv"
grade_tester_path = "csv/grade-tester.csv"
summary_coder_path = "csv/summary-coder.csv"
final_grade_path = "csv/final-grades.csv"


def simple_routine(test_grade_flag, test_weight, min_grade_or_average, number_of_test):
    """ Assuming the table "solution-table.csv" already exist (created using data from firebase). """
    code_weight = 1 - test_weight
    create_summary_coder(solution_table_path)
    create_better_coder(solution_table_path)
    create_better_tester(solution_table_path)
    if test_grade_flag:
        create_grade_tester_minimal(
            better_tester_path, number_of_test, min_grade_or_average)
    else:
        create_grade_tester_average(
            better_tester_path, number_of_test, min_grade_or_average)
    create_grade_coder(better_coder_path, number_of_test)
    create_final_grade(grade_tester_path,
                       grade_coder_path, test_weight, code_weight, final_grade_path)


def complex_routine(test_grade_flag, test_weight, min_grade_or_average, test_lambda, code_lambda, number_of_test):
    """ Assuming the table "solution-table.csv" already exist (created using data from firebase). """
    code_weight = 1 - test_weight
    create_summary_coder(solution_table_path)
    create_better_coder(solution_table_path)
    create_better_tester(solution_table_path)
    if test_grade_flag:
        create_complex_grade_tester_minimal(
            better_coder_path, summary_coder_path, number_of_test, min_grade_or_average, test_lambda)
    else:
        create_complex_grade_tester_average(
            better_coder_path, summary_coder_path, number_of_test, min_grade_or_average, test_lambda)
    create_complex_grade_coder(
        better_tester_path, summary_coder_path, number_of_test, code_lambda)
    create_final_grade(grade_tester_path,
                       grade_coder_path, test_weight, code_weight, final_grade_path)


number_of_student = 20
number_of_test = create_solution_table(number_of_student)

complex_routine(True, 0.3, 80, 0.5, 0.5, number_of_test)
# simple_routine(True, 0.3, 80, number_of_test)

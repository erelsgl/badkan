import pandas as pd
import operator
import collections


def sort_table_and_write(totals, path, header):
    serie = sort_table(totals)
    write_table(serie, path, header)


def sort_table(totals):
    sorted_x = sorted(totals.items(), key=operator.itemgetter(1), reverse=True)
    totals = collections.OrderedDict(sorted_x)
    return pd.Series(list(totals.values()), index=list(totals.keys()))


def write_table(serie, path, header):
    with open(path, 'w') as f:
        serie.to_csv(f, header=header)


def sort_table_by_id(grade_tester_path, grade_coder_path):
    test_grades = pd.read_csv(grade_tester_path)
    code_grades = pd.read_csv(grade_coder_path)
    test_grades = test_grades.sort_values('ID')
    code_grades = code_grades.sort_values('ID')
    code_grades = code_grades.drop(code_grades.columns[0], axis=1)
    test_grades = test_grades.drop(test_grades.columns[0], axis=1)
    test_grades.to_csv(grade_tester_path, header=['ID', 'GRADES'])
    code_grades.to_csv(grade_coder_path, header=['ID', 'GRADES'])

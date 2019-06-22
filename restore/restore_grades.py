"""
This script attempt to restore the grade using the trace table.
Notice the header: Date	Url	Ids	Grade Exercise
"""

import csv
import pandas as pd
import numpy as np
import os


def csv_rm(tables):
    for table in tables:
        if os.path.isfile(table):
            os.remove(table)


def read_and_union_trace_tables(tables):
    for table in tables:
        trace_table = pd.read_csv(table, error_bad_lines=False, names=[
                                  "Date", "Url", "Ids", "Grade", "Exercise"])
        trace_table.Grade = pd.to_numeric(trace_table.Grade, 'coerce')
        trace_table.Grade[trace_table.Grade == trace_table.Grade // 1]
        trace_table = trace_table[trace_table.Grade <= 100]
        trace_table = trace_table.iloc[:, 0:5]
        lines = [[]]
        for index in trace_table.iterrows():
            line = index[1]
            ids = line.Ids.split("-")
            for id in ids:
                if id != "" and line.Exercise != "Assignment 1" and line.Exercise != "assignment 1" and line.Exercise != "Ex5":
                    lines.append([rename_exercise(line.Exercise), id, "Anonymous",
                                  "Anonymous", line.Grade, line.Url])
        grades_table = pd.DataFrame(lines)
        write_table(grades_table, "temp_table.csv", [
            "Exercise Name", "id", "name", "lastName", "grade", "url"])


def rename_exercise(exercise_name):
    if exercise_name == "Matala 1: Bash compilation check" or str(exercise_name) == "nan":
        return "1: Bash compilation check"
    elif exercise_name == "Matala 2: binary tree - part B":
        return "2 B: binary tree - full implementation"
    elif exercise_name == "Physical numbers - part B":
        return "3 B: Physical numbers - full implementation"
    elif exercise_name == "Bull Pgia - Part B":
        return "4 B: Bull Pgia - full implementation"
    elif exercise_name == "itertools - part B":
        return "5 B: itertools - full implementation"
    else:
        return exercise_name


def create_grades_table():
    grades_table = pd.read_csv("temp_table.csv")
    grades_table.grade = pd.to_numeric(grades_table.grade, 'coerce')
    grades_table.id = pd.to_numeric(grades_table.id, 'coerce')
    grades_table = grades_table[grades_table.id > 99999999] 
    grades_table = grades_table[grades_table.id < 1000000000] 
    grades_table = grades_table.sort_values(
        'grade').drop_duplicates(['id', 'Exercise Name'], keep='last')
    grades_table = grades_table.sort_values(['id'])
    write_table(grades_table, "grades_table.csv",  [
        "Exercise Name", "id", "name", "lastName", "grade", "url"])


def write_table(table, path, header):
    with open(path, 'a') as f:
        table.to_csv(f, header=header, index=False)


def routine():
    trace_tables = ["trace_table.190505.csv", "trace_table.csv"]
    created_tables = ["temp_table.csv", "grades_table.csv"]
    csv_rm(created_tables)
    read_and_union_trace_tables(trace_tables)
    create_grades_table()


routine()

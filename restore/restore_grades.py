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
        write_table(trace_table, "temp_table.csv", ["Date", "Url", "Ids",
                                                    "Grade", "Exercise"])


def create_last_submission_table():
    table_to_clean = pd.read_csv("temp_table.csv")
    table_to_clean.Grade = pd.to_numeric(table_to_clean.Grade, 'coerce')
    clean_table = table_to_clean.sort_values(
        'Grade').drop_duplicates(['Url'], keep='last')
    write_table(clean_table, "clean_table.csv",  ["Date", "Url", "Ids",
                                                  "Grade", "Exercise"])


def create_grade_table():
    """ Make the table with the header: Exercise Name id name lastName grade url """
    lines = [[]]
    table_to_clean = pd.read_csv("clean_table.csv")
    for index in table_to_clean.iterrows():
        line = index[1]
        ids = line.Ids.split("-")
        for id in ids:
            if id != "":
                lines.append([line.Exercise, id, "Anonymous",
                              "Anonymous", line.Grade, line.Url])
    write_table(pd.DataFrame(lines), "grades_table.csv", [
                "Exercise Name", "id", "name", "lastName", "grade", "url"])


def log_table(table):
    for line in table:
        print(line)


def write_table(table, path, header):
    with open(path, 'a') as f:
        table.to_csv(f, header=header, index=False)


def routine():
    trace_tables = ["trace_table.190505.csv", "trace_table.csv"]
    created_tables = ["temp_table.csv", "clean_table.csv", "grades_table.csv"]
    csv_rm(created_tables)
    read_and_union_trace_tables(trace_tables)
    create_last_submission_table()
    create_grade_table()


routine()

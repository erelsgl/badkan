import csv

#submission time, the submission url, the submitter user id, and the grade.
def edit_csv(time, url, ids, grade):
    newLine = [time, url, ids, grade]
    print(newLine)
    with open('trace_table.csv', 'a') as csvFile:
        writer = csv.writer(csvFile)
        writer.writerow(newLine)
    csvFile.close()


    


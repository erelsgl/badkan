import csv
import os
    
def edit_csv_summary(name, last_name, student_id, output, exercice_name):
    if not os.path.exists('../statistics/' + exercice_name):
        os.mkdir('../statistics/' + exercice_name)
        
    newLine = [name, last_name, student_id, output]
    line_list = []

    if os.path.exists('../statistics/' + exercice_name + '/summary.csv'):

        with open('../statistics/' + exercice_name + '/summary.csv', 'r+') as csvFile:
            lines = csv.reader(csvFile)
            line_list.extend(lines)

        csvFile.close()

    flag = True
    for row in range(0, len(line_list)):
        if line_list[row][0] == name and line_list[row][1] == last_name and  line_list[row][2] == student_id:
            line_list[row] = newLine
            flag = False
    if flag:
        line_list.append(newLine)
    
    with open('../statistics/' + exercice_name + '/summary.csv', 'w+') as csvFile:
        writer = csv.writer(csvFile)
        for row in line_list:
            writer.writerow(row)

    csvFile.close()


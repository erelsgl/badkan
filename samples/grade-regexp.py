#!python3

import re

GRADE_REGEXP = re.compile("grade.*:\\s*(\\d+)", re.IGNORECASE)

test_cases = ["grade:80","Grade:  90%", "your grade is: 70.5"]

for testcase in test_cases:
    matches = GRADE_REGEXP.search(testcase)
    if matches is not None:
        grade = matches.group(1)
        print("TESTCASE={}, GRADE={}".format(testcase,grade))

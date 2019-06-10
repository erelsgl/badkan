import re
import os

EXERCISE_DIR = os.path.realpath(os.path.dirname(
    os.path.abspath(__file__))+"/../../exercises")

# Calculate the regular expression for detecting the grade in the file.
def get_grade_regexp(current_exercise_folder: str = ""):
    result = re.compile("[*].*grade.*:\\s*(\\d+).*[*]",
                        re.IGNORECASE)   # default
    # If there is a "signature file", then the default is changed to "...(integer)...<signature>..."
    signature_file = current_exercise_folder + "/signature.txt"
    if os.path.isfile(signature_file):
        with open(signature_file) as f:
            grade_signature = f.read().strip()
            result = re.compile(
                ".*?(\\d+).*{}.*".format(re.escape(grade_signature)))
    return result

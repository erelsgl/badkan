var grade = ""

document.getElementById("btnDlGrade").addEventListener('click', e => {
    grade = "#!/bin/bash \n"
    grade += "echo \"*** Grade exercise ***\" \n \n"
    const compiler = escapeHtml(document.getElementById("compiler").value);
    const main = escapeHtml(document.getElementById("main").value);
    const numTest = escapeHtml(document.getElementById("tests").value);
    const input = escapeHtml(document.getElementById("input").value);
    const output = escapeHtml(document.getElementById("output").value);
    if (checkEmptyFieldsWithoutCoef(compiler, numTest.main)) {
        compiling(compiler);
        makeGradeWithoutCoef(compiler, numTest, input, output, main);
    }
});


function checkEmptyFieldsWithoutCoef(compiler, numTest, main) {
    var emptyField = document.getElementById("emptyField");
    if (compiler === "" || numTest === "" || main === "") {
        emptyField.className = "show";
        setTimeout(function () { emptyField.className = emptyField.className.replace("show", ""); }, 2500);
        return false;
    }
    return true;
}

function compiling(compiler) {
    switch (compiler) {
        case "java":
            grade += "echo \"javac *.java\" \n";
            grade += "javac *.java \n \n";
            break;
        // case "c++":
        //     grade += "echo \"make\" \n";
        //     grade += "make \n \n";
        //     break;
        // Python...
        default:
    }
}

function makeGradeWithoutCoef(compiler, numTest, input, output, main) {
    grade += "let total=" + numTest + "\n"
    grade += "let sum=0 \n \n";
    for (var i = 1; i <= numTest; i++) {
        switch (compiler) {
            case "java":
                if (input || output) {
                    if (input && output) {
                        grade += "cat > " + input + " << ENDOFFILE\n"
                        grade += "`cat input-" + i + ".io`\n"
                        grade += "ENDOFFILE\n\n"
                        grade += "java " + main + "\n"
                        grade += "OUTPUT=`cat " + output + "` \n"
                    }
                    else if (!input && output) {
                        grade += "INPUT=`cat input-" + i + ".io` \n"
                        grade += "java " + main + "\n"
                        grade += "OUTPUT=`cat " + output + "` \n"
                    }
                    else if (input && !ouput) {
                        grade += "cat > " + input + " << ENDOFFILE\n"
                        grade += "`cat input-" + i + ".io`\n"
                        grade += "ENDOFFILE\n\n"
                        grade += "OUTPUT=`java " + main + " $INPUT` \n";
                    }
                    grade += "EXPECTED=`cat " + "output-" + i + ".io` \n"
                }
                else {
                    grade += "INPUT=`cat input-" + i + ".io` \n"
                    grade += "OUTPUT=`java " + main + " $INPUT` \n";
                    grade += "EXPECTED=`cat " + "output-" + i + ".io` \n"
                }
                grade += "echo \"Input" + i + ": your output=$OUTPUT, expected output=$EXPECTED\" \n"
                grade += "if [ \"$OUTPUT\" == \"$EXPECTED\" ]; then \n";
                grade += "let sum++ \n"
                grade += "fi \n \n"
                break;

            // case "c++":
            //     grade += "echo \"./" + main + ".out \" \n";
            //     grade += "./" + main + ".out \n";
            //     break;

            // Python...
            default:
        }
    }
    grade += "let \"grade = sum / total * 100\" \n"
    grade += "echo \"Grade: $grade% ***\""

    download(grade, "grade", "")
    grade = "";

}

// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}
var grade = ""

var BACKEND_FILE_PORTS = [9000];

var flagCp = false;

function createGrade(exerciseFoldername) {
    grade = "#!/bin/bash \n"
    grade += "echo \"*** Grade exercise ***\" \n \n"
    const compiler = escapeHtml(document.getElementById("compiler").value);
    const main = escapeHtml(document.getElementById("main").value);
    const numTest = escapeHtml(document.getElementById("tests").value);
    const input = escapeHtml(document.getElementById("input").value);
    const output = escapeHtml(document.getElementById("output").value);
    if (checkEmptyFieldsWithoutCoef(compiler, numTest.main)) {
        compiling(compiler);
        makeGradeWithoutCoef(compiler, numTest, input, output, main, exerciseFoldername);
    }
}


function checkEmptyFieldsWithoutCoef(compiler, numTest, main) {
    var emptyField = document.getElementById("emptyField");
    if (compiler === "" || numTest === "" || main === "") {
        emptyField.className = "show";
        setTimeout(function () {
            emptyField.className = emptyField.className.replace("show", "");
        }, 2500);
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

function makeGradeWithoutCoef(compiler, numTest, input, output, main, exerciseFoldername) {
    grade += "let total=" + numTest + "\n"
    grade += "let sum=0 \n \n";
    for (var i = 1; i <= numTest; i++) {
        switch (compiler) {
            case "java":
                if (input || output) {
                    if (input && output) {
                        grade += "cat > " + input + " << ENDOFFILE\n"
                        grade += "`cat input-" + i + ".txt`\n"
                        grade += "ENDOFFILE\n\n"
                        grade += "java " + main + "\n"
                        grade += "OUTPUT=`cat " + output + "` \n"
                    } else if (!input && output) {
                        grade += "INPUT=`cat input-" + i + ".txt` \n"
                        grade += "java " + main + "\n"
                        grade += "OUTPUT=`cat " + output + "` \n"
                    } else if (input && !ouput) {
                        grade += "cat > " + input + " << ENDOFFILE\n"
                        grade += "`cat input-" + i + ".txt`\n"
                        grade += "ENDOFFILE\n\n"
                        grade += "OUTPUT=`java " + main + " $INPUT` \n";
                    }
                    grade += "EXPECTED=`cat " + "output-" + i + ".txt` \n"
                } else {
                    grade += "INPUT=`cat input-" + i + ".txt` \n"
                    grade += "OUTPUT=`java " + main + " $INPUT` \n";
                    grade += "EXPECTED=`cat " + "output-" + i + ".txt` \n"
                }
                grade += "echo output: $OUTPUT \n"
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
    grade += "let \"wrong = total - sum\" \n"
    grade += "echo \"Correct: $sum, Wrong: $wrong\" \n"
    grade += "let \"grade = sum / total * 100\" \n"
    grade += "echo \"*** Grade: $grade% ***\""

    //download(grade, "grade", "")
    var file = new File([grade], "grade");
    sendFile(file, exerciseFoldername);
    grade = "";

}

function sendFile(file, exerciseFoldername) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    var rawData = new ArrayBuffer();
    reader.loadend = function () { }
    reader.onload = function (e) {
        rawData = e.target.result;
        // create the request
        const xhr = new XMLHttpRequest();
        var backendPort = getParameterByName("backend"); // in utils.js
        if (!backendPort)
            backendPort = BACKEND_FILE_PORTS[Math.floor(Math.random() * BACKEND_FILE_PORTS.length)];
        var httpurl = "http://" + location.hostname + ":" + backendPort + "/"
        xhr.open('POST', httpurl, true);
        xhr.setRequestHeader('Accept-Language', exerciseFoldername); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
        if (flagCp) {
            xhr.setRequestHeader('Accept', 'grade_cp'); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
            console.log("cp")
        } else {
            xhr.setRequestHeader('Accept', 'grade'); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
        }
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                // success
            }
        };
        xhr.send(rawData);
    }
}
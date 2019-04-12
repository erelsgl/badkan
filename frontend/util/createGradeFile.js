var grade = "#!/bin/bash \n"
grade += "echo \"*** Grade exercise *** \""


document.getElementById("btnDlGrade").addEventListener('click', e => {
    const compiler = escapeHtml(document.getElementById("compiler").value);
    const main = escapeHtml(document.getElementById("main").value);
    const numTest = escapeHtml(document.getElementById("tests").value);
    const input = escapeHtml(document.getElementById("input").value);
    const output = escapeHtml(document.getElementById("output").value);
    if (isCoef) {
        const coef = escapeHtml(document.getElementById("coefficients").value);
        if (checkEmptyFieldsWithCoef(compiler, numTest, coef, main)) {
            compiling(compiler);
            makeGradeWithCoef(compiler, numTest, input, output, coef, main);
        }
    }
    else {
        if (checkEmptyFieldsWithoutCoef(compiler, numTest.main)) {
            compiling(compiler);
            makeGradeWithoutCoef(compiler, numTest, input, output, main);
        }
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


function checkEmptyFieldsWithCoef(compiler, numTest, coef, main) {
    var emptyField = document.getElementById("emptyField");
    if (compiler === "" || numTest === "" || coef === "" || main === "") {
        emptyField.className = "show";
        setTimeout(function () { emptyField.className = emptyField.className.replace("show", ""); }, 2500);
        return false;
    }
    return true;
}

function compiling(compiler) {
    switch (compiler) {
        case "java":
            grade += "echo \"javac *.java\"";
            grade += "javac *.java";
            break;
        case "c++":
            grade += "echo \"make\"";
            grade += "make";
            break;
        // Python...
        default:
        // code block
    }
}

function makeGradeWithoutCoef(compiler, numTest, input, output, main) {
    
    for (var i = 1; i <= numTest; i++) {
        
    }

}

function makeGradeWithCoef(compiler, numTest, input, output, coef, main) {

}

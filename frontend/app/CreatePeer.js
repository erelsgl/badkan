/**
 * 
 * This file handle the form to get all the information we need for the peer-to-peer process.
 * 
 * 
 * For the object PeerExercise:
 * 
 * @param {string} name 
 * @param {string} description 
 * @param {string} ownerId 
 * @param {Object} peerGrades // Object we created with the gradees.
 * @param {date} deadlineTest 
 * @param {date} deadlineSolution 
 * @param {date} deadlineConflicts 
 * @param {string} compilerSolution // java by default (on the frontend readonly).
 * @param {string} compilerTest // junit by default (on the frontend readonly).
 * @param {Object} submission 
 * @param {int} minTest 
 * @param {map} signatureMap 
 *
 * 
 *
 * For the object submission:
 * 
 * @param {string} id // Uid from firebase
 * @param {int} gradeTest 
 * @param {int} gradeSolution 
 * @param {string} urlTest 
 * @param {string} urlSolution 
 *
 *
 * All the field are required.
 */

/**
 * BUTTON HELP.
 * TODO: Complete the info. (send link to paper).
 */
document.getElementById("btnHelp").addEventListener('click', e => {
    alert("On this page, you can create a new peer-to-peer exercise. \n");
});




/**
 * BUTTON CONFIRM.
 */
document.getElementById("btnConfirm").addEventListener('click', e => {
    document.getElementById("page").style.display = "none";
    document.getElementById("loadingEx").style.display = "block";

    const name = escapeHtml(document.getElementById("exName").value);
    const descr = escapeHtml(document.getElementById("exDescr").value);
    const file = document.getElementById('instruction').files[0];

    // We need to check if the date are logic: dealineTest < dealineSol < dealineCon
    const dealineTest = document.getElementById("dealineTest").value;
    const dealineSol = document.getElementById("dealineSol").value;
    const dealineCon = document.getElementById("dealineCon").value;

    if (!logicalTime(dealineTest, dealineSol, dealineCon)) {
        document.getElementById("page").style.display = "block";
        document.getElementById("loadingEx").style.display = "none";
        alert("Please check the deadline.");
        return;
    }

    const compilerTest = escapeHtml(document.getElementById("testLanguage").value);
    const compilerSolution = escapeHtml(document.getElementById("solLanguage").value);

    let github = document.getElementById("github").checked;
    let zip = document.getElementById("zip").checked;
    let gitlab = document.getElementById("gitlab").checked;
    // Here we first check that the user at least check one of the parameter.
    if (!github && !zip && !gitlab) {
        document.getElementById("page").style.display = "block";
        document.getElementById("loadingEx").style.display = "none";
        alert("Please check at least one submission option.");
        return;
    }
    let submission = new ViaSubmission(github, zip, gitlab);

    let minTest = escapeHtml(document.getElementById("minTest").value);

    let signatures = escapeHtml(document.getElementById("signatures").value);
    let signatureMap = parseMap(signatures);

    if (checkEmptyFieldsPeer(name, descr, file, dealineTest, dealineSol, dealineCon, compilerTest,
        compilerSolution, submission, minTest, signatureMap)) {
        uploadPeerExercise(name, descr, dealineTest, dealineSol, dealineCon, compilerTest,
            compilerSolution, submission, minTest, signatureMap);
    }

});

function logicalTime(date1, date2, date3) {
    return date1 < date2 && date2 < date3;
}

/**
 * The required format for the string is:
 * function signature; class where the function resides.
 * e.g: public static int myFun(int num1, int num2); MyClass.java
 * @param {string} signatures 
 */
function parseMap(signatures) {
    let signaturesSplitted = signatures.split(";");
    let signatureMap = [];
    let helpMap = new Map();
    for (let i = 0; i < signaturesSplitted.length; i++) {
        if (i + 1 < signaturesSplitted.length) {
            if (!helpMap.has(signaturesSplitted[i + 1])) {
                helpMap.set(signaturesSplitted[i + 1], [signaturesSplitted[i++]]);
            } else {
                helpMap.get(signaturesSplitted[i+1]).push(signaturesSplitted[i++]);
            }
        }
    }
    for (var [key, value] of helpMap) {
        signatureMap.push(new Signature(value, key));
    }
    return signatureMap;
}
/**
 * All the file are required.
 * @param {} name 
 * @param {*} descr 
 * @param {*} file 
 * @param {*} compiler 
 */
function checkEmptyFieldsPeer(name, descr, file, deadlineTest, deadlineSolution, deadlineConflicts,
    compilerSolution, compilerTest, submission, minTest, signatureMap) {
    var emptyField = document.getElementById("emptyField");
    if (!name || !descr || !file || !deadlineTest || !deadlineSolution || !deadlineConflicts ||
        !compilerSolution || !compilerTest || !submission || !minTest || !signatureMap || signatureMap.size == 0) {
        document.getElementById("page").style.display = "block";
        document.getElementById("loadingEx").style.display = "none";
        emptyField.className = "show";
        setTimeout(function () {
            emptyField.className = emptyField.className.replace("show", "");
        }, 2500);
        return false;
    }
    return true;
}

/**
 * @param {String} name 
 * @param {string} descr 
 * @param {String} link 
 * @param {String} username 
 * @param {String} pass 
 * @param {String} exFolder 
 */
function uploadPeerExercise(name, descr, deadlineTest, deadlineSolution, deadlineConflicts,
    compilerSolution, compilerTest, submission, minTest, signatureMap) {
    var userId = firebase.auth().currentUser.uid;
    var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
    folderName = userId + "_" + homeUser.createdEx;

    let peerExercise = new PeerExercise(
        name, descr, userId, deadlineTest,
        deadlineSolution, deadlineConflicts, compilerSolution, compilerTest, submission, minTest, signatureMap
    );
    incrementCreatedExAndSubmitCourse(userId, homeUser);
    writePeerExercise(peerExercise, folderName);
    editCourseCreatePeer(folderName);
    uploadPdf(folderName);
}


function editCourseCreatePeer(peerExerciseId) {
    let courseId = JSON.parse(localStorage.getItem("courseId"));
    let course = JSON.parse(localStorage.getItem("course"));
    course.exercises.push(peerExerciseId);
    editCourse(course, courseId);
}

function uploadPdf(peerExerciseId) {
    var file = document.getElementById('instruction').files[0];
    storage.ref(peerExerciseId).put(file).then(function (snapshot) {
        document.getElementById("form").submit();
        document.location.href = "manageCourses.html";
    }).catch(error => {
        alert(error)
    })
}
/**
 * This method check that all the field are filed.
 * @param {String} name 
 * @param {String} lastName 
 * @param {Stirng} id 
 */
function checkEmptyFields(args) {
    console.log(JSON.stringify(args))
    var emptyField = document.getElementById("emptyField");
    if (args.includes(undefined) || args.includes("")) {
        emptyField.className = "show";
        setTimeout(function () { emptyField.className = emptyField.className.replace("show", ""); }, 2500);
        return false;
    }
    return true;
}
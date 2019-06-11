function checkViaSubmission(github, zip, gitlab) {
    if (!github && !zip && !gitlab) {
        alert("Please check at least one submission option.");
        return false;
    } else {
        return true;
    }
}
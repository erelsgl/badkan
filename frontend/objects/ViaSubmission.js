class ViaSubmission {

    constructor(github, zip, gitlab) {
        this.github = github;
        this.zip = zip;
        this.gitlab = gitlab;
    }

}

function isGithub(submission) {
    return submission.github;
}

function isZip(submission) {
    return submission.zip;
}

function isGitlab(submission) {
    return submission.gitlab;
}
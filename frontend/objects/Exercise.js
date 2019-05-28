/**
 * This object is an Exrcise created by any instructor.
 */
class Exercise {
    
    /**
     * 
     * @param {string} name 
     * @param {string} description 
     * @param {string} example 
     * @param {string} ownerId 
     * @param {string} link 
     * @param {string} exFolder 
     * @param {grades} submissionsId 
     * @param {string} compiler
     * @param {Submission}
     */
    constructor(name, description, example, ownerId, link, exFolder, submissionsId, deadline, compiler, submission) {
        this.name = name;
        this.description = description;
        this.example = example;
        this.ownerId = ownerId;
        this.link = link;
        this.submissionsId = submissionsId;
        this.exFolder = exFolder;
        this.deadline = deadline;
        this.compiler = compiler;
        this.submission = submission;
    }

}



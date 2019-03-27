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
     * @param {grades} grades 
     */
    constructor(name, description, example, ownerId, link, exFolder, grades) {
        this.name = name;
        this.description = description;
        this.example = example;
        this.ownerId = ownerId;
        this.link = link;
        this.grades = grades;
        this.exFolder = exFolder;
    }

}



class PeerGrade {
    /**
     * 
     * @param {string} id // Uid from firebase
     * @param {int} gradeTest 
     * @param {int} gradeSolution 
     * @param {string} urlTest 
     * @param {string} urlSolution 
     */
    constructor(id, gradeTest, gradeSolution, urlTest, urlSolution) {
        this.id = id;
        this.gradeTest = gradeTest;
        this.gradeSolution = gradeSolution;
        this.urlTest = urlTest;
        this.urlSolution = urlSolution;
    }
}
class PeerExercise {

    /**
     * 
     * @param {string} name 
     * @param {string} description 
     * @param {string} ownerId 
     * @param {Object} peerGrades // Object we created with the gradees.
     * @param {date} dealdineTest 
     * @param {date} dealdineSolution 
     * @param {date} deadlineConflicts 
     * @param {string} compilerSolution // java by default (on the frontend readonly).
     * @param {string} compilerTest // junit by default (on the frontend readonly).
     * @param {Object} submission //
     * @param {int} minTest 
     * @param {map} signatureMap 
     */
    constructor(name, description, ownerId, peerGrades, dealdineTest,
        dealdineSolution, deadlineConflicts, compilerSolution, compilerTest, submission, minTest, signatureMap) {
        this.name = name;
        this.description = description;
        this.ownerId = ownerId;
        this.peerGrades = peerGrades;
        this.dealdineTest = dealdineTest;
        this.dealdineSolution = dealdineSolution;
        this.deadlineConflicts = deadlineConflicts;
        this.compilerSolution = compilerSolution;
        this.compilerTest = compilerTest;
        this.submission = submission;
        this.minTest = minTest;
        this.signatureMap = signatureMap;
    }
    
}
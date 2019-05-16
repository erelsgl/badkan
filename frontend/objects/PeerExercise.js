class PeerExercise {

    /**
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
     * @param {Object} submission //
     * @param {int} minTest 
     * @param {map} signatureMap 
     */
    constructor(name, description, ownerId, peerGrades, deadlineTest,
        deadlineSolution, deadlineConflicts, compilerSolution, compilerTest, submission, minTest, signatureMap) {
        this.name = name;
        this.description = description;
        this.ownerId = ownerId;
        this.peerGrades = peerGrades;
        this.deadlineTest = deadlineTest;
        this.deadlineSolution = deadlineSolution;
        this.deadlineConflicts = deadlineConflicts;
        this.compilerSolution = compilerSolution;
        this.compilerTest = compilerTest;
        this.submission = submission;
        this.minTest = minTest;
        this.signatureMap = signatureMap;
    }

    whichPhase() {
        var currentTime = new Date();
        var deadlineTest = new Date(PeerExercise.deadlineTest);
        var deadlineSolution = new Date(PeerExercise.deadlineSolution);
        var deadlineConflicts = new Date(PeerExercise.deadlineConflicts);
        if (currentTime < deadlineTest) {
            return "Test Phase"
        } else if (currentTime < deadlineSolution) {
            return "Solution Phase"
        } else if (currentTime < deadlineConflicts) {
            return "Conflicts Phase"
        }
        else {
            return "The exercise is over"
        }

    }

    // function whichPhase(PeerExercise) {
    //     var currentTime = new Date();
    //     var deadlineTest = new Date(PeerExercise.deadlineTest);
    //     var deadlineSolution = new Date(PeerExercise.deadlineSolution);
    //     var deadlineConflicts = new Date(PeerExercise.deadlineConflicts);
    //     if (currentTime < deadlineTest) {
    //         return "Test Phase"
    //     } else if (currentTime < deadlineSolution) {
    //         return "Solution Phase"
    //     } else if (currentTime < deadlineConflicts) {
    //         return "Conflicts Phase"
    //     }
    //     else {
    //         return "The exercise is over"
    //     }
}
class Submission {

        /**
         * Note that will saving in firebase, we use a custom pk: exerciseId_userId
         * @param {*} exerciseId 
         * @param {*} submitterId // may be equal or different than userId
         * @param {*} grade 
         * @param {*} manualGrade 
         * @param {*} url // github / gitlab / "zip"
         * @param {*} timestamp 
         * @param {*} collaboratorsId // country ID
         * @param {*} instructorComment 
         */
        constructor(exerciseId, submitterId, submitterUid, grade, manualGrade, url,
                timestamp, collaboratorsId, collaboratorsUid, instructorComment) {
                this.exerciseId = exerciseId;
                this.submitterId = submitterId;
                this.submitterUid = submitterUid;
                this.grade = grade;
                this.manualGrade = manualGrade;
                this.url = url;
                this.timestamp = timestamp;
                this.collaboratorsId = collaboratorsId;
                this.collaboratorsUid = collaboratorsUid
                this.instructorComment = instructorComment;
        }

}
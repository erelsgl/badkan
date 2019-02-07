class Exercise:
    def __init__(self,name, description,  user_id,  difficulty, points, exercise_path):
        """
        :param exercise_id: String.
        :param user_id: Owner of the Exercise.
        :param name: String.
        :param name: Name of file.

        """
        self.user_id = user_id
        self.exercise_id = exercise_id
        self.name = name
        self.size = size
        self.difficulty = difficulty
        self.points = points
        self.exercise_path = exercise_path
        self.description = description

    def edit_exercise(self, name, description, user_id, difficulty, points):
        if self.user_id != user_id:
            return
        else:
            self.name = name
            self.difficulty = difficulty
            self.points = points
            self.description = description
            #write to sql

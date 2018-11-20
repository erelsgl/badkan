class Excersice:
    def __init__(self, exercise_id, user_id, name,
                 size,difficulty, points, exercise_path, solution_path):
        """
        :param exercise_id: String.
        :param user_id: Owner of the Exercise.
        :param name: String.
        :param name: Name of file.
        :param size: int (int bytes?).
        :param exercise_path: String.
        :param solution_path: String.
        """
        self.user_id = user_id
        self.exercise_id = exercise_id
        self.name = name
        self.size = size
        self.difficulty = difficulty
        self.points = points
        self.exercise_path = exercise_path
        self.solution_path = solution_path

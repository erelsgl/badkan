class Course:
    def __init__(self, Course_id, user_id, name,excersice_path ):
        """
        :param file_id: String.
        :param user_id: String.
        :param exercise_id: String.
        :param name: Name of file.
        :param size: int (int bytes?).
        :param file_type: String.
        :param file_path: String.
        """
        self.Course_id = Course_id
        self.user_id = user_id
        self.excersice_path = excersice_path
        self.name = name
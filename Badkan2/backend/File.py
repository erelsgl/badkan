class File:
    def __init__(self, file_id, user_id, exercise_id, name,
                 size, file_type, file_path):
        """
        :param file_id: String.
        :param user_id: String.
        :param exercise_id: String.
        :param name: Name of file.
        :param size: int (int bytes?).
        :param file_type: String.
        :param file_path: String.
        """
        self.file_id = file_id
        self.user_id = user_id
        self.exercise_id = exercise_id
        self.name = name
        self.size = size
        self.file_type = file_type
        self.birthday = birthday
        self.file_path = file_path

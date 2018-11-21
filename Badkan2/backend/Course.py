import os
import errno
import Exercise
class Course:
    def __init__(self, course_id, user_id, name ):
        """
        :param file_id: String.
        :param user_id: String.
        :param exercise_id: String.
        :param name: Name of file.
        """
        self.course_id = course_id
        self.user_id = user_id
        self.name = name
        self.ex_list = []
        self.course_path = os.getcwd() + '/' + name

        try:
            os.makedirs(course_path)
        except OSError as e:
            if e.errno != errno.EEXIST:
                raise
        # write shit to sql.

    def add_exercise(self, name,user_id, difficulty, points):
        exercise_path = course_path + '/' + name
        try:
            os.makedirs(course_path)
        except OSError as e:
            if e.errno != errno.EEXIST:
                raise
        ex = Exercise(name, description, user_id,  difficulty, points, exercise_path )

        self.ex_list.append(ex_obj)
        # write shit to sql.

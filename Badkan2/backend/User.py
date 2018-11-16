class User:
    def __init__(self, badkan_username, mail, user_id="", name="",
                 family_name="", university="", birthday="", courses=[]):
        """
        :param badkan_username: The unique username of the user String.
        :param mail: The mail of the user String.
        :param user_id: The id for grades String.
        :param name: The name for grades String.
        :param family_name: The family name for grades String.
        :param university: String.
        :param birthday: String.
        :param courses: Array of Python object (Course).
        """
        self.badkan_username = badkan_username
        self.mail = mail
        self.user_id = user_id
        self.name = name
        self.family_name = family_name
        self.university = university
        self.birthday = birthday
        self.courses = courses

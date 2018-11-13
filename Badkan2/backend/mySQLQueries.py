import pymysql.cursors

mysql_port = "3306"
mysql_hostname = "localhost"	 # 127.0.0.1
mysql_username = 'root'
mysql_password = 'root'
mysql_database = 'Badkan2'


def make_a_query(query):
    """
    :param query: String.
    :return the result of the query.
    """
    connection = pymysql.connect(host=mysql_hostname,
                                 user=mysql_username,
                                 password=mysql_password,
                                 db=mysql_database,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    try:
        with connection.cursor() as cursor:
            cursor.execute(query)
            connection.commit()
            result = cursor.fetchone()
            return result
    finally:
        connection.close()


def sign_up(badkan_username, badkan_password, mail="", user_id="", name="", family_name="", university="", birthday=""):
    """
    :param badkan_username: the user name of the user PK and NN STRING.
    :param badkan_password: the password of the user NN STRING.
    :param mail: the mail of the user STRING.
    :param user_id: example 342533064 STRING not mandatory.
    :param name: Samuel STRING not mandatory.
    :param family_name: Bismuth STRING not mandatory.
    :param university: Ariel STRING not mandatory.
    :param birthday: The birthday is a DATE (YYYY-MM-DD) not mandatory.
    The DATE must be with a good format.
    :return: error + false if the user can't register (usually because of the username is already in use
    , else, if the registration is done, return true.)
    """
    try:
        make_a_query("INSERT INTO `Badkan2`.`Registration`"
                     " (`user_name`, `password`, `mail`, `user_id`, "
                     "`name`, `family_name`, `university`, `birthday`)"
                     " VALUES ('" + badkan_username + "', '" + badkan_password + "', '" + mail + "', '" + user_id + "',"
                     " '" + name + "', '" + family_name + "', '" + university + "', '" + birthday + "');")
        return True
    except pymysql.err.IntegrityError:
        print("Error: The user-name is already in use...")
        return False


def sign_in(badkan_username, badkan_password):
    """
    :param badkan_username: String.
    :param badkan_password: String.
    :return: false if there is no match, else return true.
    """
    if str(make_a_query("SELECT user_name FROM Badkan2.Registration WHERE user_name = '"
                        + badkan_username + "' AND password = '" + badkan_password + "';")) == 'None':
        return False
    else:
        return True


def register_file(file_id, author_id, exercise_id, name, size, file_type, file_path,):
    """
    :param file_id: unique id of the file.
    :param author_id: unique id of the author.
    :param exercise_id: unique id of the exercise
    :param name: name of the file (maybe unnecessary?? we have in path), STRING.
    :param size: size in bytes.
    :param file_type: type of file String(.h,.cpp..).
    :param file_path: path for file in host, STRING.
    :return: error + false if the file can't register (usually because of the username is already in use,
    else, if the registration is done, return true.)
    """
    try:
        make_a_query("INSERT INTO `Badkan2`.`Files`"
                     " (`file_id`,`author_id`, `exercise_id`, `name`, `size`, "
                     "`type`, `path`)"
                     " VALUES ('" + file_id + "','" + author_id + "', '" + exercise_id + "', '" + name + "', "
                     "'" + size + "'," " '" + file_type + "', '" + file_path + "');")
        return True
    except pymysql.err.IntegrityError:
        print("Error: The file-name is already in use...")
        return False


# Attention: mysql doesn't make difference between Joni and JonI.
# Fix if cause it's also true for password !! -> gUilad == guilad.
print(sign_up('Yehonatan', 'Maayan_melove', 'joni@gmail.com', "930488675", 'Joni', 'Shaag', 'Ariel', '1986-05-13'))
print(sign_in('Joni', 'gUilad'))
print(register_file('123', '123', '123', 'Source', '123', 'cpp', '\home\ehud'))

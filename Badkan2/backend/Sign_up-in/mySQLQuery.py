import pymysql.cursors

port = "3306"
hostname = "localhost"	 # 127.0.0.1
username = 'root'
password = 'root'
database = 'Badkan2'

connection = pymysql.connect(host=hostname,
                             user=username,
                             password=password,
                             db=database,
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)


def make_a_query(query):
    """
    :param query:
    """
    try:
        with connection.cursor() as cursor:
            cursor.execute(query)
            connection.commit()
            result = cursor.fetchone()
            print(result)
    finally:
        connection.close()


def sign_up(user_name, mail, user_password, user_id="", name="", family_name="", university="", birthday=""):
    """
    :param user_name: the user name of the user PK and NN STRING.
    :param mail: the mail of the user PK and NN STRING.
    :param user_password: the password of the user NN STRING.
    :param user_id: exemple 342533064 STRING not mandatory.
    :param name: Samuel STRING not mandatory.
    :param family_name: Bismuth STRING not mandatory.
    :param university: Ariel STRING not mandatory.
    :param birthday: The birthday is a DATE (YYYY-MM-DD) not mandatory.
    The DATE must be with a good format.
    """
    try:
        make_a_query("INSERT INTO `Badkan2`.`Registration`"
                     " (`user_name`, `mail`, `password`, `user_id`, "
                     "`name`, `family_name`, `university`, `birthday`)"
                     " VALUES ('" + user_name + "', '" + mail + "', '" + user_password + "', '" + user_id + "',"
                     " '" + name + "', '" + family_name + "', '" + university + "', '" + birthday + "');")
    except pymysql.err.IntegrityError:
        print("Error: The mail or user-name is already in use...")

def sign_in():


sign_up('JOni', 'ehud@gmail.com', 'guilad', "930488675", 'Ehud', 'Plaskin', 'Ariel', '1996-05-13')
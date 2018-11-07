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
    try:
        with connection.cursor() as cursor:
            cursor.execute(query)
            connection.commit()
            result = cursor.fetchone()
            print(result)
    finally:
        connection.close()


def new_registration(user_name, mail, user_password, user_id="", name="", family_name="", university="", birthday=""):
    """
    The user_name and mail are PK and NN.
    The password is NN.
    All the rest is not mandatory.
    The birthday is a DATE (YYYY-MM-DD), all the rest a STRING.
    The DATE must be with a good format.
    """
    make_a_query("INSERT INTO `Badkan2`.`Registration`"
                 " (`user_name`, `mail`, `password`, `user_id`, "
                 "`name`, `family_name`, `university`, `birthday`)"
                 " VALUES ('" + user_name + "', '" + mail + "', '" + user_password + "', '" + user_id + "',"
                 " '" + name + "', '" + family_name + "', '" + university + "', '" + birthday + "');")


new_registration('EhudHahamoud', 'ehud@gmail.com', 'guilad', "930488675", 'Ehud', 'Plaskin', 'Ariel', '1996-05-13')

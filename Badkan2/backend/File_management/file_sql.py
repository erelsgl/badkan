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
def register_file(file_id,author_id,excercise_id,name, size, file_type, file_path,):
    """
    :param author_id: unique id of the author.
    :param excercise_id: unique id of the exercise.
    :param name: name of the file (maybe unnecessary?? we have in path), STRING.
    :param path: path for file in host, STRING.
    :param size: size in bytes.
    :param type: type of file String(.h,.cpp..).
    :return: error + false if the file can't register (usually because of the username is already in use
    , else, if the registration is done, return true.)
    """
    try:
        make_a_query("INSERT INTO `Badkan2`.`Files`"
                     " (`file_id`,`author_id`, `exercise_id`, `name`, `size`, "
                     "`type`, `path`)"
                     " VALUES ('" + file_id + "','" + author_id + "', '" + excercise_id + "', '" + name + "', '" + size + "',"
" '" + file_type + "', '" + file_path + "');")
        return True
    except pymysql.err.IntegrityError:
        print("Error: The file-name is already in use...")
        return False

print(register_file('123','123','123','Source','123','cpp','\home\ehud'))
import pymysql.cursors

port = "3306"
hostname = "localhost"	 # 127.0.0.1
username = 'root'
password = 'root'
database = 'Badkan2'

myConnection = pymysql.connect(host=hostname,
                               user=username,
                               password=password,
                               db=database,
                               charset='utf8mb4',
                               cursorclass=pymysql.cursors.DictCursor)


def make_a_query(query):
    cursor = myConnection.cursor()
    cursor.execute(query)
    for row in cursor:
        return row[query[7:query.find(" FROM")]]  # make_a_query("SELECT email FROM Teachers WHERE firstName = 'אראל'")
    cursor.close()
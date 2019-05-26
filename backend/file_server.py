import time
from http.server import BaseHTTPRequestHandler, HTTPServer
import cgi
import subprocess
import os, sys

"""
IF THERE IS A PROBLEM OF SIMULTANEOUS SUBMISSION THERE ARE TWO SOLUTION:
USE NUMEROUS PORT.
MULTIPROCESSING.
"""

HOST_NAME = '0.0.0.0'
PORT_NUMBER = int(sys.argv[1]) if len(sys.argv)>=2 else 9000   # TODO: Where is this port used in the frontend?

class MyHandler(BaseHTTPRequestHandler):

    def do_POST(self):
        filename = self.headers['Accept-Language']
        filesize = int(self.headers['Content-Length'])
        contents = self.rfile.read(filesize)
        if self.headers['Accept'] == 'grade':
            f = open("grade", 'w+b')
            f.write(contents)   
            f.close()
            self.send_response(200)
            return
        elif  if self.headers['Accept'] == 'grade-cp':
            f = open("grade", 'w+b')
            f.write(contents)   
            f.close()
            self.send_response(200)
            shellscript = subprocess.Popen(['bash','bash/cp-grade.sh', filename], stdout=subprocess.PIPE)
            return
        f = open(filename, 'w+b')
        f.write(contents)   
        f.close()
        if self.headers['Accept'] == 'create':
            shellscript = subprocess.Popen(['bash','bash/create-ex.sh', filename], stdout=subprocess.PIPE)
        elif self.headers['Accept'] == 'create-template':
            shellscript = subprocess.Popen(['bash','bash/create-ex-template.sh', filename], stdout=subprocess.PIPE)
        else:
            shellscript = subprocess.Popen(['bash','bash/solve-ex.sh', filename], stdout=subprocess.PIPE)
        self.send_response(200)

    def do_GET(self):
        self._set_headers()
        path = self.headers['Accept-Language']

        if self.headers['Accept'] == 'dlProject':
            print("debug")
            x = path.split("/")
            shellscript = subprocess.Popen(['bash','bash/dl-project.sh', x[1], x[0]], stdout=subprocess.PIPE)
            shellscript.wait()
            zip_file = open(x[0] + ".zip", 'rb')
            self.wfile.write(zip_file.read())

            shellscript = subprocess.Popen(['bash','bash/rm-file.sh', x[0]], stdout=subprocess.PIPE)

        elif self.headers['Accept'] == 'dlSummary':
            exercice_name = self.headers['Accept-Language']
            if os.path.exists('../statistics/' + exercice_name + '/summary.csv'):
                csv_file = open('../statistics/' + exercice_name + '/summary.csv', 'rb')
                self.wfile.write(csv_file.read())

        else:
            x = path.split("@$@")
            exo = x[0]
            informations = x[1].replace("-", " ")
            shellscript = subprocess.Popen(['bash','bash/dl-all-projects.sh', exo, informations], stdout=subprocess.PIPE)
            shellscript.wait()
            zip_file = open(exo + ".zip", 'rb')
            self.wfile.write(zip_file.read())

            shellscript = subprocess.Popen(['bash','bash/rm-file.sh', exo], stdout=subprocess.PIPE)

    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.send_header("Content-type:", "application/zip")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        self.send_header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
        self.end_headers()

    def do_HEAD(self):
        self._set_headers()

    def response(self, code, headers): 
        self.send_response(int(code))
        for key in headers: 
            self.send_header(key, headers[key]) 
            self.end_headers() 

    def handle_http(self, status_code, path):
        self.send_response(status_code)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        content = '''
        <html><head><title>Title goes here.</title></head>
        <body><p>This is a test.</p>
        <p>You accessed path: {}</p>
        </body></html>
        '''.format(path)
        return bytes(content, 'UTF-8')

    def respond(self, opts):
        response = self.handle_http(opts['status'], self.path)
        self.wfile.write(response)

if __name__ == '__main__':

    server_class = HTTPServer
    httpd = server_class((HOST_NAME, PORT_NUMBER), MyHandler)
    print(time.asctime(), 'Server Starts - %s:%s' % (HOST_NAME, PORT_NUMBER))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
print(time.asctime(), 'Server Stops - %s:%s' % (HOST_NAME, PORT_NUMBER))
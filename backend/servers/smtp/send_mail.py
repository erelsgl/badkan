import smtplib

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

address = open("smtp/address.txt", "r")
password = open("smtp/password.txt", "r")

MY_ADDRESS = address.read()
PASSWORD = password.read()


def send_mail(message, subject):
    print(MY_ADDRESS)
    print(PASSWORD)
    s = smtplib.SMTP(host='smtp-mail.outlook.com', port=587)
    s.starttls()
    s.login(MY_ADDRESS, PASSWORD)
    msg = MIMEMultipart()
    msg['From'] = MY_ADDRESS
    msg['To'] = MY_ADDRESS
    msg['Subject'] = subject
    msg.attach(MIMEText(message, 'plain'))
    s.send_message(msg)
    del msg
    s.quit()

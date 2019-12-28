# Use an official Ubuntu runtime as a parent image
FROM ubuntu:latest

# Install any needed packages specified in requirements.txt
RUN apt-get update
RUN apt-get -y install git build-essential python3 unzip default-jdk

RUN mkdir grading_room
RUN mkdir www

# Set the working directory to /
WORKDIR /

# Copy required files into the container:
COPY files/grade.sh   /
COPY www-readme.md       /www/README.md

# Run bash when the container launches
CMD /bin/bash

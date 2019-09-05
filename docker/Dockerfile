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

# COPY files/get-submission.sh   /
# COPY files/get-submission-file.sh   /
# COPY files/get-private-submission.sh   /
# COPY files/get-test-submission-file.sh   /
# COPY files/get-solution-submission-file.sh   /
# COPY files/create-template-gradle.sh   /
# COPY files/create-signature.sh   /
# COPY files/clean-folder.sh   /
# COPY files/build.gradle   /
# COPY www-readme.md       /www/README.md

# Run bash when the container launches
CMD /bin/bash

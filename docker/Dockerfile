# Use an official Ubuntu runtime as a parent image
FROM ubuntu:latest

# Install any needed packages specified in requirements.txt
RUN apt-get update --fix-missing
RUN apt-get -y install git build-essential clang++-9 bc clang-tidy-5.0 valgrind python3 unzip default-jdk

RUN mkdir grading_room
RUN mkdir www

# Set the working directory to /
WORKDIR /

# Copy required files into the container:
COPY files/grade.sh   /
COPY files/run_custom.sh   /
COPY files/run_custom_by_zip.sh /
COPY files/run_zip_submission_with_zip_exercise.sh /
COPY files/clean_docker.sh /
COPY www-readme.md       /www/README.md

# Run bash when the container launches
CMD /bin/bash

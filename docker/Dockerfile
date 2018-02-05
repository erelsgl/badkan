# Use an official Python runtime as a parent image
FROM ubuntu:16.04

# Install any needed packages specified in requirements.txt
RUN apt-get update
RUN apt-get -y install git build-essential clang++-5.0 clang-tidy-5.0
RUN mkdir submissions

# Set the working directory to /
WORKDIR /

# Copy the current directory contents into the container at /app
COPY grade-single-submission.sh /

# Define environment variable
ENV NAME World

# Run bash when the container launches
CMD /bin/bash


# TO BUILD:
# sudo docker build -t erelsgl/badkan:1.0 .
# sudo docker image tag erelsgl/badkan:1.0 erelsgl/badkan:latest
#
# TO RUN:
# sudo docker run --name badkan --rm -i -t erelsgl/badkan bash
#
# TO COPY FOLDER (e.g. a new homework folder):
# sudo docker cp 00-multiply badkan:/

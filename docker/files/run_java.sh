#!/usr/bin/env bash
# INPUT: 
# ACTION: 

export FILE=$1
export INPUT=$2

iter=$(echo $FILE | tr "." "\n")
arr=($iter)
java ${arr[0]} $INPUT

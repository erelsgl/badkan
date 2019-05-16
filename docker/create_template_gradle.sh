#!/usr/bin/env bash
# INPUT: check if template for gradlle exist: if yes do nothing, if not create it.
# ACTION: the path to the3 folder.

export OWNERID=$1
export EXID=$2

cd submissions

if [ -d $OWNERID ]; then
    echo "! cd $OWNERID"
    cd $OWNERID
    if [ ! -d $EXID ]; then
       # Need to create the template.
       echo "! mkdir $EXID"
       mkdir $EXID
       echo "! cd $EXID"
       cd $EXID
       echo "! mkdir mkdir -p src/{main/java,test/java}"
       mkdir -p src/{main/java,test/java}
       pwd
       cp ../../../build.gradle .
    fi
else
    mkdir $OWNERID
    echo "! cd $OWNERID"
    cd $OWNERID
    echo "! mkdir $EXID"
    mkdir $EXID
    echo "! cd $EXID"
    cd $EXID
    # Need to create the template.
    echo "! mkdir mkdir -p src/{main/java,test/java}"
    mkdir -p src/{main/java,test/java} 
    pwd
    cp ../../../build.gradle .
fi


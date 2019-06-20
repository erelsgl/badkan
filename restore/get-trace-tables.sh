#!/usr/bin/env bash
# INPUT: no input required.
# ACTION: copy the data from the trace table to the local computer.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "cd $DIR"
cd $DIR

echo "scp root@104.248.40.179:/root/badkan/backend/trace_table.csv  ."
scp root@104.248.40.179:/root/badkan/backend/trace_table.csv  .

echo "scp root@104.248.40.179:/root/badkan/backend/trace_table.190505.csv  ."
scp root@104.248.40.179:/root/badkan/backend/trace_table.190505.csv  .
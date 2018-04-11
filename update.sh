#!/usr/bin/env bash
git add *
git commit -m "minor update"
git push
ssh amitp01@31.154.73.178 "cd ~amitp01/badkan; git pull"

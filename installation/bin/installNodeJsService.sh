#!/bin/bash
#v201206

FD=/usr/lib/systemd/system/

cp webserver.service $FD

systemctl enable webserver.service
systemctl start  webserver.service





  

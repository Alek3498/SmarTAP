#!/bin/bash
#v201206

#---------------------
# Definitions
#---------------------
source /opt/SmarTAP/conf/envvars

FD=/usr/lib/systemd/system/
CF=taprules.service


sed "s/ExecStart=.*/ExecStart=\/opt\/SmarTAP\/system\/setrules.sh/g" < $CF > in;
cp -f in $CF
rm in

cp $CF $FD

systemctl disable taprules.service
systemctl enable taprules.service
systemctl start taprules.service




  

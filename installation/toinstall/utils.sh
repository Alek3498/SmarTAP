#!/usr/bin/sh

yum install -y  jq bind-utils nmap links mtr mc finger lm_sensors htop tcpdump screen net-tools iftop nload rrdtool net-snmp net-snmp-utils psmisc


#GUI
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
yum install -y nodejs


rpm -i --nosignature ./toinstall/klish-2.0.4-3cnt7.x86_64.rpm

if [ $? ];then
	mv  ./toinstall/klish-2.0.4-3cnt7.x86_64.rpm /var/tmp/cawa.erepeeme
fi






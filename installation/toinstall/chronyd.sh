#!/usr/bin/sh


yum remove ntp ntpdate -y

yum install chrony -y

#timedatectl set-timezone America/Manaus
timedatectl set-timezone America/Argentina/Buenos_Aires

service chronyd restart

chronyc tracking
chronyc sources -v



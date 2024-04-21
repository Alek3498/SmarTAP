#!/bin/bash
#v201206

#---------------------
# Definitions
#---------------------
source /opt/SmarTAP/conf/envvars

LOCAL=$3
REMOTE=$2
MASK="/24"
TUNIF=$1

echo -e "#####################################"
echo -e "# SETTING TUNNEL!!                  #"
echo -e "#####################################\n"

ip link del tun0 &> /dev/null

ip link add tun0 type gretap remote $REMOTE local $LOCAL dev $TUNIF key $KEY
ip link set dev tun0 mtu $MTU
ip addr add dev tun0 $LOCAL$MASK 
ip link set tun0 up

exit $?

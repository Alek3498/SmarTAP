#!/bin/bash
#v201206

source /opt/SmarTAP/conf/envvars


	tunif=$(cat $CONF | grep TUNIF | cut -f 2 -d =)
	tcpdump -l -n -i $tunif -vvv | grep GRE

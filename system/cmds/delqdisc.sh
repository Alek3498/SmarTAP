#!/bin/bash
#v210113

#---------------------
# Definitions
#---------------------
source /opt/SmarTAP/conf/envvars

#Interface to filter
INIF=$1
PROMS=bond0

function Print {
	echo -e "\n#-------------------------#"
	echo -e   "# $1 $2" 
	echo -e   "#-------------------------#\n"
}


if [ -z $INIF ];then
	INIF=$PROMS
	Print "Selected:" $INIF 
else
	Print "Selected:" $INIF 
fi

tc qdisc del dev $INIF handle ffff: ingress 2> /dev/null 
if [ $? ];then
	chmod 666 $PREFIX/conf/rules.cfg
	cat /dev/null > $PREFIX/conf/rules.cfg
	tc qdisc show  dev $INIF
fi



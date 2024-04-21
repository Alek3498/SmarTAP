#!/bin/bash
#v201206

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

tc filter del dev $INIF parent ffff:
tc -s -p filter ls dev $INIF parent ffff:

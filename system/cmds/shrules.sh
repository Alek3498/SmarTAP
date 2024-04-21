#!/bin/bash
#v201206


PROMS=bond0
INIF=$PROMS
T=10 #seconds

function Print {
	echo -e "\n#-------------------------#"
	echo -e   "# $1 $2" 
	echo -e   "#-------------------------#\n"
}



if [ -z $1 ];then
	tc -s -p filter ls dev $INIF parent ffff:| grep -e 'match' -e 'Sent' -e 'meta' > in
	sed 's/Sent.*/&\n -----------------------------------------------------------------------------------/g' < in > in2;cat in2
	rm in in2
	 
else
		# To check: qdisc, filter & packet counters
		while true
		do
		#	Print "Checking qdisc..." $INIF
		#	tc qdisc show  dev $INIF
			Print "Checking filters..." $INIF
			tc -s -p filter ls dev $INIF parent ffff:| grep -e 'match' -e 'Sent' -e 'meta' 
			sleep $T 
		done
fi







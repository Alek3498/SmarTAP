#!/bin/bash
#v201206

FD=/usr/lib/systemd/system/

cp promisc@.service $FD

#--------------------------------
# Starting from eth2, to set them 
# as a collector interfaces
#--------------------------------
for i in {2..5}
do
	ret=$(ip link | grep eth$i >> /dev/null;echo $?)
	if [ $ret -eq 0 ];then
		echo eth$i
		systemctl enable promisc@eth$i
		systemctl start  promisc@eth$i
	fi
done
systemctl enable promisc@bond0
systemctl start  promisc@bond0

ip link | grep -i promisc




  

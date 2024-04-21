#!/bin/bash
#v201206

#---------------------
# Definitions
#---------------------
source /opt/SmarTAP/conf/envvars

OSCONF=/etc/sysconfig/network-scripts
JSENV=$PREFIX/webguiSONDAS/webgui/.env

#-----------------------------------------
# Getting from net.conf mgmt interface parameters
#-----------------------------------------
mgtif=$(cat $CONF | grep MGTIF | cut -f 2 -d =)
addr=$(cat $CONF | grep MGTADDR | cut -f 2 -d =)
mask=$(cat $CONF | grep MGTMASK | cut -f 2 -d =)
gw=$(cat $CONF | grep MGTGW | cut -f 2 -d =)



function Ifcfg {
		cp -f $PREFIX/installation/network/ifcfg-ethX.template	$OSCONF/ifcfg-$1

		if [ "$gw" ];then
			echo "DEFROUTE=yes" >> $OSCONF/ifcfg-$1
			echo "GATEWAY=$gw" >> $OSCONF/ifcfg-$1 
		else
			Logger "ERROR: No given gateway for $1" 1
			Logger "ERROR: It's not possible to set mgmt on $1" 1
			Logger "ERROR: Check net.conf->MGTGW" 1
			rm $OSCONF/ifcfg-$1
			exit
		fi

		if [ "$addr" ];then
			echo "IPADDR=$addr" >> $OSCONF/ifcfg-$1
		else	
			Logger "ERROR: No given address for $1" 1
			Logger "ERROR: It's not possible to set mgmt on $1" 1
			Logger "ERROR: Check net.conf->MGTADDR" 1
			rm $OSCONF/ifcfg-$1
			exit
		fi

		if [ "$mask" ];then
			echo "NETMASK=$mask" >> $OSCONF/ifcfg-$1
		else
			Logger "ERROR: No given mask for $1" 1
			Logger "ERROR: It's not possible to set mgmt on $1" 1
			Logger "ERROR: Check net.conf->MGTMASK" 1
			rm $OSCONF/ifcfg-$1
			exit
		fi
		
			echo "NAME=$mgtif" >> $OSCONF/ifcfg-$1
			echo "DEVICE=$mgtif" >> $OSCONF/ifcfg-$1

		ifdown $1
                ifup $1

		Logger "Management has been set!!" 1
}

function NodeJS {
		echo "API_FRONTEND=$addr" > $JSENV
		Logger "API env updated" 0
		pkill node
		if [ $? ];then
			sleep 2
			Logger "webserver has been stop" 0
			systemctl start webserver.service
			#npm run start --prefix /opt/SmarTAP/webguiSONDAS/webgui/
			if [ $? ];then
				Logger "webserver has been restart" 0
			fi
		else
			Logger "webserver couldnt been stopped" 0
		fi
}

function Logger {
	logger -t $TAG $1

	if [  $2 -eq 1 ];then
		echo $1
	fi
} 

                Ifcfg $mgtif
		NodeJS




#!/bin/bash
#v210109

#---------------------
# Definitions
#---------------------
source /opt/SmarTAP/conf/envvars

FD=/usr/lib/systemd/system/
RULESC=$PREFIX/system/setrules.sh
TUNCONF=$PREFIX/system/tunnel-0.sh
TUNSRV=$PREFIX/installation/bin/tunnel.service
OSCONF=/etc/sysconfig/network-scripts


#-----------------------------------------
# Take in account that for tunnel
# srcip and dstip must be different segments
# if not, this won work!
# srcip must be unique.
#-----------------------------------------



#-----------------------------------------
# When tunnel is set on an interface that
# it is not the mgmt interface
#-----------------------------------------
function Ifcfg {

		#-----------------------------------------
		# Getting from net.conf interface parameters
		# where the tunnel will lie: interface, dstip,
		# tunip, tungw
		#-----------------------------------------
		mgtif=$(cat $CONF | grep MGTIF | cut -f 2 -d =)
		addr=$(cat $CONF | grep TUNADDR | cut -f 2 -d =)
		mask=$(cat $CONF | grep TUNMASK | cut -f 2 -d =)
		gw=$(cat $CONF | grep TUNGW | cut -f 2 -d =)
		cp -f $PREFIX/installation/network/ifcfg-ethX.template	$OSCONF/ifcfg-$1
		
		if [ "$addr" ];then
			echo "DEFROUTE=no" >> $OSCONF/ifcfg-$1
			echo "IPADDR=$addr" >> $OSCONF/ifcfg-$1
		else
			Logger "ERROR: No given address for $1"
			Logger "ERROR: It's not possible to set tunnel on $1"
			Logger "ERROR: Check net.conf->TUNADDR"
			rm $OSCONF/ifcfg-$1
			exit
		fi

		if [ "$mask" ];then
			echo "NETMASK=$mask" >> $OSCONF/ifcfg-$1
		else
			Logger "ERROR: No given mask for $1"
			Logger "ERROR: It's not possible to set tunnel on $1"
			Logger "ERROR: Check net.conf->TUNMASK"
			rm $OSCONF/ifcfg-$1
			exit
		fi
			echo "NAME=$1" >> $OSCONF/ifcfg-$1
			echo "DEVICE=$1" >> $OSCONF/ifcfg-$1
		
		if [  "$gw" ];then
			retcmd=$(route add -host $2 gw $gw)
			echo "route add -host $2 gw $gw" >> $OSCONF/ifcfg-$1
		else
			Logger "ERROR: No given gateway for $1"
			Logger "ERROR: It's not possible to set tunnel on $1"
			Logger "ERROR: Check net.conf->TUNGW"
			rm $OSCONF/ifcfg-$1
			exit
		fi
		
		ifdown $1
                ifup $1
}

function Logger {
	logger -t $TAG $1
	echo $1
} 


#######################################################################
# Main
#######################################################################


	#---------------------------------
	# Reading net.cfg
	#---------------------------------
	mgtif=$(cat $CONF | grep MGTIF  | cut -f 2 -d =)
	tunif=$(cat $CONF | grep TUNIF | cut -f 2 -d =)
	tundst=$(cat $CONF | grep TUNDST | cut -f 2 -d =)
	tunsrc=$(cat $CONF | grep TUNSRC | cut -f 2 -d =)

	#---------------------------------
	# Is this tunnel over the mgmt if?
	# If false, call Ifcfg function	
	#---------------------------------
	if [ $mgtif != $tunif ];then
		Ifcfg $tunif $tundst		
	else
		retcmd=$(route del -host $tundst)
		ifdown eth1
		rm $OSCONF/ifcfg-eth1
		sleep 2
	fi

	#---------------------------------
	# Setting tunnel
	#---------------------------------
	$TUNCONF $tunif $tundst $tunsrc

	sed "s/ExecStart=.*/ExecStart=\/opt\/SmarTAP\/system\/tunnel-0.sh\ ${tunif}\ ${tundst}\ ${tunsrc}/" < $TUNSRV > in;
	cp -f in $TUNSRV
	rm in
 
	cp $TUNSRV $FD

	systemctl disable tunnel.service
	systemctl enable tunnel.service
	systemctl start tunnel.service
	
	echo "#-----------------------------------#"
	Logger "# Tunnel Set:-> $tunif $tunsrc $tundst"
	echo "#-----------------------------------#"
	sleep 2

	$RULESC
	if [ $? ];then
		echo "#-----------------------------------#"
		echo "# Rules were re-applied!!"
		echo "#-----------------------------------#"
	fi
	
	ip addr



  

#!/bin/bash
#v201206

#-----------------------------------
# Flag to show up 
# debug msgs
#-----------------------------------
DEBUG=0

#-----------------------------------
# Interfaces
#-----------------------------------
PROMS=bond0
TUN=tun0
INIF=$PROMS
OUTIF=$TUN

#-----------------------------------
# Env vars
#-----------------------------------
VARS=/opt/SmarTAP/conf/envvars


TOK="0"
true=0
false=1
#-----------------------------------
# Include
#-----------------------------------
source $VARS
source $RCONF




##########################################################################
##########################################################################
#-----------------------------------
# Functions
#-----------------------------------

function Print {
	echo -e "------------------------------------#"
	echo -e "# $1 $2" 
	echo -e "#-----------------------------------#"
}

#-----------------------------------
# Qdisc
#-----------------------------------
function Ingress {
	tc qdisc del dev $INIF handle ffff: ingress
	tc qdisc add dev $INIF handle ffff: ingress
}


#-----------------------------------
# Everything.
#-----------------------------------
function ALL {

	tc filter add dev $INIF parent ffff: \
	u32 \
	match ip protocol 6 0xff \
	action mirred egress redirect dev $OUTIF

	tc filter add dev $INIF parent ffff: \
	u32 \
	match ip protocol 17 0xff \
	action mirred egress redirect dev $OUTIF

	tc filter add dev $INIF parent ffff: \
	u32 \
	match ip protocol 1 0xff \
	action mirred egress redirect dev $OUTIF

}

#-----------------------------------
# Argument: VLAN ID 
#-----------------------------------
function VLAN {

	if [ $DEBUG -eq 1 ];then
		echo "vlan mask 0xfff eq $1"	
	fi
	
	tc filter add dev $INIF parent ffff: \
	basic \
	match "meta(vlan mask 0xfff eq $1)" \
	action mirred egress redirect dev $OUTIF
}


#-----------------------------------
# Arguments: proto ID & port 
#-----------------------------------
function PROTOPORT {

	if [ $DEBUG -eq 1 ];then
		echo -e "\n------------------------------------------"
		echo "Parameters received: protocol $1 & dport $2"	
	fi


	# No dport
	if [[ "$2" == "$TOK" ]];then

		if [ $DEBUG -eq 1 ];then
			echo -e "------------------------------------------"
			echo "proto: match ip protocol $1"
			echo "tc filter add dev $INIF parent ffff: u32 match ip protocol $1 action mirred egress redirect dev $OUTIF"
			echo -e "------------------------------------------\n"
		fi

		tc filter add dev $INIF parent ffff: \
		u32 \
		match ip protocol $1 0xff \
		action mirred egress redirect dev $OUTIF

	# No proto
	elif [[ "$1" == "$TOK" ]];then

		if [ $DEBUG -eq 1 ];then
			echo -e "------------------------------------------"
			echo "dport: match ip dport $2"
			echo "tc filter add dev $INIF parent ffff: u32 match ip dport $2 action mirred egress redirect dev $OUTIF"
			echo -e "------------------------------------------\n"
		fi

		tc filter add dev $INIF parent ffff: \
		u32 \
		match ip dport $2 0xff \
		action mirred egress redirect dev $OUTIF

	# proto + dport
	else

		if [ $DEBUG -eq 1 ];then
			echo -e "------------------------------------------"
			echo "proto dport: match ip proto $1 dport $2"
			echo "tc filter add dev $INIF parent ffff: u32 match ip protocol $1 match ip dport $2 action mirred egress redirect dev $OUTIF"
			echo -e "------------------------------------------\n"
		fi

		tc filter add dev $INIF parent ffff: \
		u32 \
		match ip protocol $1 0xff \
		match ip dport $2 0xff \
		action mirred egress redirect dev $OUTIF

	fi


}


#-----------------------------------
# Arguments: srcip & dstip & dport 
#-----------------------------------
function IPIPPORT {
	
	if [ $DEBUG -eq 1 ];then
		echo -e "\n------------------------------------------"
		echo "Parameters received: ip src $1 & ip dst $2 & dport $3"	
	fi

	# Only srcip
	if [[ "$2" == "$TOK" && "$3" == "$TOK" ]];then

		if [ $DEBUG -eq 1 ];then
			echo -e "------------------------------------------"
			echo "srcip: match ip src $1"
			echo "tc filter add dev $INIF parent ffff: u32 match ip src $1 action mirred egress redirect dev $OUTIF"
			echo -e "------------------------------------------\n"
		fi

		tc filter add dev $INIF parent ffff: \
		u32 \
		match ip src $1 \
		action mirred egress redirect dev $OUTIF

	# Only dstip
	elif [[ "$1" == "$TOK" && "$3" == "$TOK" ]];then

		if [ $DEBUG -eq 1 ];then
			echo -e "------------------------------------------"
			echo -e "dstip: match ip dst $2"
			echo "tc filter add dev $INIF parent ffff: u32 match ip dst $2 action mirred egress redirect dev $OUTIF"
			echo -e "------------------------------------------\n"
		fi

		tc filter add dev $INIF parent ffff: \
		u32 \
		match ip dst $2 \
		action mirred egress redirect dev $OUTIF

	# No dport
	elif [[ "$3" == "$TOK" ]];then
	
		if [ $DEBUG -eq 1 ];then
			echo -e "------------------------------------------"
			echo -e "No dport: match ip src $1 + ip dst $2"
			echo "tc filter add dev $INIF parent ffff: u32 match ip src $1 match ip dst $2 action mirred egress redirect dev $OUTIF"
			echo -e "------------------------------------------\n"
		fi

		tc filter add dev $INIF parent ffff: \
		u32 \
		match ip src $1 \
		match ip dst $2 \
		action mirred egress redirect dev $OUTIF

	# No dstip
	elif [[ "$2" == "$TOK" ]];then

		if [ $DEBUG -eq 1 ];then
			echo -e "------------------------------------------"
			echo -e "No dstip: match ip src $1 + dport $3"
			echo "tc filter add dev $INIF parent ffff: u32 match ip src $1 match ip dport $3 action mirred egress redirect dev $OUTIF"
			echo -e "------------------------------------------\n"
		fi

		tc filter add dev $INIF parent ffff: \
		u32 \
		match ip src $1 \
		match ip dport $3 0xff\
		action mirred egress redirect dev $OUTIF


	# No srcip
	elif [[ "$1" == "$TOK" ]];then

		if [ $DEBUG -eq 1 ];then
			echo -e "------------------------------------------"
			echo -e "No srcip: match ip dst $2 + dport $3"
			echo "tc filter add dev $INIF parent ffff: u32 match ip dst $2 match ip dport $3 action mirred egress redirect dev $OUTIF"
			echo -e "------------------------------------------\n"
		fi

		tc filter add dev $INIF parent ffff: \
		u32 \
		match ip dst $2 \
		match ip dport $3 0xff\
		action mirred egress redirect dev $OUTIF

	# srcip + dstip + dport
	else

		if [ $DEBUG -eq 1 ];then
			echo -e "------------------------------------------"
			echo -e "Everything: match ip src $1 + ip dst $2 + dport $3"
			echo "tc filter add dev $INIF parent ffff: u32 match ip src $1 match ip dst $2 match ip dport $3 action mirred egress redirect dev $OUTIF"
			echo -e "------------------------------------------\n"
		fi


		tc filter add dev $INIF parent ffff: \
		u32 \
		match ip src $1 \
		match ip dst $2 \
		match ip dport $3 0xff\
		action mirred egress redirect dev $OUTIF

	fi

}


#-----------------------------------
# Check for valid values and range
#-----------------------------------
function VlanCheck {

	local retcod

	if [[ "$1" =~ [^0-9] ]]; then
		echo "VLAN ID must be numeric!!. ID=$1"
		retcod=$false
	else
		if [ "$1" -le 4094 ]; then
			retcod=$true
		else
			echo "VLAN ID must be in between 0-4094!!. ID=$1"
			retcod=$false
		fi
	fi
	return $retcod
}


function IpCheck {

    local  IPA1=$1
    local  stat=1

    if [[ $IPA1 =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]];
    then
        OIFS=$IFS

	IFS='.'		# This is internal field separator; which is set as '.' 
        ip=($ip)	# IP value is saved as array
        IFS=$OIFS	# setting IFS back to its original value;

        [[ ${ip[0]} -le 255 && ${ip[1]} -le 255 \
           && ${ip[2]} -le 255 && ${ip[3]} -le 255 ]]  # It's testing if any part of IP is more than 255
        stat=$? #If any part of IP as tested above is more than 255 stat will have a non zero value
    fi
    return $stat # as expected returning

}


function CheckALL {
	ret=${ALL[0]}
}


##########################################################################
##########################################################################
#--------------------------
# Main
#--------------------------


	Print "Interfaces selected:" "$INIF -> $OUTIF"
	CheckALL
	Ingress

if [ -z $ret ];then
# Applying rules

	#--------------------------------------------------------------------
	# Cheking VLAN array size
	# Expected array: 
	#	VLAN=( vlan-1 vlan-2 ... vlan-n)
	#--------------------------------------------------------------------
	ret=${#VLAN[*]}
	if [ $ret -gt 0 ];then
		if [ $DEBUG -eq 1 ];then
			echo -e "\n"
			Print "Filtering by vlan" "rules=$ret" 
		fi
		for (( c=0; c<$ret; c++ ))	
		do
			VlanCheck ${VLAN[$c]}
			if [  $? -eq $true ];then
 
				VLAN ${VLAN[$c]} 

			fi
		done
	fi


	#--------------------------------------------------------------------
	# Cheking PROTOPORT array size
	# Expected array: 
	#	PROTOPORT=( proto-1:port-1 proto-2:port-2 ... proto-n:port-n)
	#--------------------------------------------------------------------
	ret=${#PROTOPORT[*]}
	if [ $ret -gt 0 ];then
		if [ $DEBUG -eq 1 ];then
			echo -e "\n"
			Print "Filtering by proto:port" "rules=$ret" 
		fi
		for (( c=0; c<$ret; c++ ))	
		do
			raw=${PROTOPORT[$c]}
			proto=$(echo $raw | cut -d ':' -f 1)
			port=$(echo $raw | cut -d ':' -f 2)
			PROTOPORT $proto $port
		done
	fi


	#--------------------------------------------------------------------
	# Cheking IPIPPORT array size
	# Expected array: 
	#	IPIPPORT=( srcip-1/cidr:dstip-1/cidr:dstport-1 srcip-2/cidr:dstip-2/cidr:dstport-2 ... srcip-n/cidr:dstip-2/cidr:dstport-n)
	#--------------------------------------------------------------------
	ret=${#IPIPPORT[*]}
	if [ $ret -gt 0 ];then
		if [ $DEBUG -eq 1 ];then
			echo -e "\n"
			Print "Filtering by srcip:dstip:dport" "rules=$ret"
		fi
		for (( c=0; c<$ret; c++ ))	
		do
			raw=${IPIPPORT[$c]}
			srcip=$(echo $raw | cut -d ':' -f 1)
			dstip=$(echo $raw | cut -d ':' -f 2)
			dstport=$(echo $raw | cut -d ':' -f 3)

			# On testing
			#--------------------------	
			IpCheck $srcip
			#echo Ret=$?
			#--------------------------	
			
			IPIPPORT $srcip $dstip $dstport
		done
	fi



else
	Print "Filtering everything"
	ALL
fi









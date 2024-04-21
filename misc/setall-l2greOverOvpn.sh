#!/bin/bash


#  vpn
#ovpn tunnel
IF=tun0
#gre tunnel
TUN=tun1
#IPDST=192.168.1.108
IPDST=192.168.1.170
#IPDST=10.0.0.53
#IPSRC=10.0.0.170
#ovpn local IP
IPSRC=10.8.0.2
MASK="/24"
MTU=9000
KEY=200
################################
# Tunnel
################################

/usr/sbin/ip link del $TUN &> /dev/null
#exit
/usr/sbin/ip link add $TUN type gretap remote $IPDST local $IPSRC dev $IF key $KEY 
/usr/sbin/ip link set dev $TUN mtu $MTU
/usr/sbin/ip addr add dev $TUN $IPSRC$MASK

/usr/sbin/ip link set $TUN up
/usr/sbin/ip a

setrules

shrules


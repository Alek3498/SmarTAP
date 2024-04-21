#!/bin/bash
#v201206

#---------------------
# Definitions
#---------------------
source /opt/SmarTAP/conf/envvars
PKGS=./toinstall
SYS=$PREFIX/system
CRON=crontab/root
ENV=env
ETC=etc
MOD=modprobe.d
GRUB=/etc/default
BGS=bg
NET=network
OSNET=/etc/sysconfig/network-scripts
PIC=grub2-dtk-wp-1.jpg
UEFI=/boot/efi/EFI/centos/grub.cfg
CLISH=./clish


d=$(date +%y%m%d)

function Print {
	echo -e "\n#-------------------------#"
	echo -e   "# $1 $2" 
	echo -e   "#-------------------------#\n"
}

function Pkgs {

	$PKGS/repo-enable.sh
	$PKGS/repo-Development_Tools.sh
	$PKGS/repo-EPEL.sh
	$PKGS/chronyd.sh
	$PKGS/utils.sh
	$PKGS/FW-off.sh
	rm -f /etc/clish/*
	cp -rf $CLISH /etc/clish
}

function Environment {

	cp -f $CRON /var/spool/cron
	cp -f $ENV/.bashrc /root
	cp -f $ENV/.bash_profile /root
	cp -f $MOD/* /etc/modprobe.d
	cp -f $ETC/motd /etc
	cp -f $ETC/ssh/sshd_config /etc/ssh
	cp -f $ETC/snmpd.conf /etc/snmp/
	cp -f $BGS/* /usr/share/backgrounds


	#--------------------------------------------------------------- 
	# Configuration is only allow by
	# plain files in /etc/sysconfig/network-scripts
	#--------------------------------------------------------------- 
	systemctl stop NetworkManager
	systemctl disable NetworkManager

	#--------------------------------------------------------------- 
	# Copy all the ifcfg-ethX confs to the OS network configuration
	# folder. It require a reboot. 
	#--------------------------------------------------------------- 
	cp $NET/* $OSNET/
	rm -f $OSNET/ifcfg-ethX.template

	#--------------------------------------------------------------- 
	# Default User
	#---------------------------------------------------------------
	Print "Adding default user admin" 
	useradd -c "Admin" -s /usr/bin/clish admin
	Print "Adding default user admin to wheel group" 
	usermod -aG wheel admin
	Print "Setting password for default user admin" 
	passwd admin

	#--------------------------------------------------------------- 
	# User Daitek
	#---------------------------------------------------------------
	Print "Adding support user" 
	useradd -c "Daitek" -m -d /home/daitek -s /bin/bash daitek
	Print "Adding support user to wheel group" 
	usermod -aG wheel daitek
	Print "Setting password for support user" 
	passwd daitek

	#--------------------------------------------------------------- 
	# Sudo User
	#---------------------------------------------------------------
	cp /etc/sudoers /etc/sudoeres.$d	
	sed 's/%wheel/#%wheel/g' <  /etc/sudoers > in
	sed 's/# #%wheel/%wheel/g' <  in  > /etc/sudoers
	Print "Sudoers file modified" 
 
}

function Grub {

	# setting video output
	cp $GRUB/grub	$GRUB/grub.$d
	sed s/console/gfxterm/g < $GRUB/grub > in
	cp in $GRUB/grub;rm in

	# setting old interface naming 
	sed s/rhgb/"net.ifnames=0 biosdevname=0 rhgb"/g < $GRUB/grub > in
	cp in $GRUB/grub;rm in
 
	# setting background
	#echo GRUB_VIDEO_BACKEND="vga" >> $GRUB/grub
	#echo GRUB_BACKGROUND=/usr/share/backgrounds/$PIC >> $GRUB/grub

	if [ -e $UEFI ];then
		# compiling everything On UEFI-based systems
		grub2-mkconfig -o "$(readlink -e $UEFI)"
	else
		# compiling everything
		grub2-mkconfig -o "$(readlink -e /etc/grub2.cfg)"
	fi

	
	#---------------------------------------------------------
	# REBOOT and after that run again this script but with 
	# NET function alone
	#---------------------------------------------------------

}

function Net {
	
	cd bin
	./installPromiscService.sh
	./installTunnelService.sh
	./installRulesService.sh
	./installNodeJsService.sh
	cp * $SYS
	cd ../
}




	if [ -e $OSNET/ifcfg-eth0 ];then
		#Execute after a reboot
		Net
	else
		#---------------------------------------------------------
		# First round
		#---------------------------------------------------------
		Pkgs
		Environment
		Grub
		reboot
	fi
  

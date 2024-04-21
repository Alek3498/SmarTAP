#!/bin/bash
#banddwidth-eth0.sh - Status bandwidth
# Path to rrdtool:
rrdtool=/usr/bin/rrdtool
# Path to rrdtool database:
db=/opt/SmarTAP/rrdtool/rrd/bandwidth-eth0.rrd
# Path to images:
img=/opt/SmarTAP/webguiSONDAS/webgui/public/imagenes

if [ ! -e $db ]
then 
	rrdtool create $db --start N DS:in:COUNTER:600:U:U DS:out:COUNTER:600:U:U RRA:AVERAGE:0.5:1:432
fi

rrdupdate $db N:`/usr/bin/snmpget -v 2c -c AllUserCommunity -Oqv localhost IF-MIB::ifInOctets.2`:`/usr/bin/snmpget -v 2c -c AllUserCommunity -Oqv localhost IF-MIB::ifOutOctets.2`

for period in day week month year
do
variable=""
if [ $period == day ];then
	variable="Diario"
elif [ $period == week ];then
	variable="Semanal"
elif [ $period == month ];then
	variable="Mensual"
elif [ $period == year ];then
	variable="Anual"
fi

$rrdtool graph --title "Estadistica de Trafico "$variable" - eth0" $img/bandwidth-eth0-$period.png -a PNG -h 125 -s -1$period -v "Data Throughput " \
    DEF:in=$db:in:AVERAGE \
    DEF:out=$db:out:AVERAGE \
    'CDEF:kbin=in,1024,/' \
    'CDEF:kbout=out,1024,/' \
    'AREA:in#00FF00:eth0 In'	                                    'LINE1:out#0000FF:eth0 Out\j' \
    'GPRINT:kbin:LAST:Last Bandwidth In\:    %3.2lf KBps'           'GPRINT:kbout:LAST:Last Bandwidth Out\:   %3.2lf KBps\j' \
    'GPRINT:kbin:AVERAGE:Average Bandwidth In\: %3.2lf KBps'        'GPRINT:kbout:AVERAGE:Average Bandwidth Out\:%3.2lf KBps\j'  > /dev/null
	
done

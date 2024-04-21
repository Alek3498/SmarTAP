#!/bin/bash
#memdisponible.sh - Status Memory
# Path to rrdtool:
rrdtool=/usr/bin/rrdtool
# Path to rrdtool database:
db=/opt/SmarTAP/rrdtool/rrd/cpu.rrd
# Path to images:
img=/opt/SmarTAP/webguiSONDAS/webgui/public/imagenes
if [ ! -e $db ]
then 
	$rrdtool create $db \
	DS:load1:GAUGE:600:0:U \
	DS:load5:GAUGE:600:0:U \
	DS:load15:GAUGE:600:0:U \
	DS:cpuuser:COUNTER:600:0:100 \
	DS:cpunice:COUNTER:600:0:100 \
	DS:cpusystem:COUNTER:600:0:100 \
	RRA:AVERAGE:0.5:1:1440 \
	RRA:AVERAGE:0.5:1440:1 \
	RRA:MIN:0.5:1440:1 \
	RRA:MAX:0.5:1440:1
fi

$rrdtool update $db N:`/bin/sed "s/\([0-9]\\.[0-9]\\{2\\}\)\ \([0-9]\\.[0-9]\\{2\\}\)\ \([0-9]\\.[0-9]\\{2\\}\).*/\1:\2:\3/" < /proc/loadavg`:`/usr/bin/head -n 1 /proc/stat | /bin/sed "s/^cpu\ \+\([0-9]*\)\ \([0-9]*\)\ \([0-9]*\).*/\1:\2:\3/"`


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

$rrdtool graph $img/load-$period.png -s -1$period -a PNG \
		-Y -u 1.1 -l 0 -L 5 -v "Carga" -w 497 -h 226 -t "Estado de Carga y CPU - $period `/bin/date`" -z \
		-c "BACK#FFFFFF" -c "SHADEA#FFFFFF" -c "SHADEB#FFFFFF" \
		-c "MGRID#AAAAAA" -c "GRID#CCCCCC" -c "ARROW#333333" \
		-c "FONT#333333" -c "AXIS#333333" -c "FRAME#333333" \
		DEF:load1=$db:load1:AVERAGE \
		DEF:load5=$db:load5:AVERAGE \
		DEF:load15=$db:load15:AVERAGE \
		DEF:user=$db:cpuuser:AVERAGE \
		DEF:nice=$db:cpunice:AVERAGE \
		DEF:sys=$db:cpusystem:AVERAGE \
		CDEF:cpu=user,nice,sys,+,+ \
		CDEF:reluser=load15,user,100,/,* \
		CDEF:relnice=load15,nice,100,/,* \
		CDEF:relsys=load15,sys,100,/,* \
		CDEF:idle=load15,100,cpu,-,100,/,* \
		HRULE:1\#000000 \
		COMMENT:"	" \
		AREA:reluser\#FF0000:"CPU user" \
		STACK:relnice\#00AAFF:"CPU nice" \
		STACK:relsys\#FFFF00:"CPU system" \
		STACK:idle\#00FF00:"CPU idle" \
		COMMENT:"	\j" \
		COMMENT:"	" \
		LINE1:load1\#000FFF:"Load average 1 min" \
		LINE2:load5\#000888:"Load average 5 min" \
		LINE3:load15\#000000:"Load average 15 min" \
		COMMENT:"	\j" \
		COMMENT:"\j" \
		COMMENT:"	" \
		GPRINT:load15:MIN:"Load 15 min minimum\: %lf" \
		GPRINT:load15:MAX:"Load 15 min maximum\: %lf" \
		GPRINT:load15:AVERAGE:"Load 15 min average\: %lf" \
		COMMENT:"	\j" \
		COMMENT:"	" \
		GPRINT:cpu:MIN:"CPU usage minimum\: %lf%%" \
		GPRINT:cpu:MAX:"CPU usage maximum\: %lf%%" \
		GPRINT:cpu:AVERAGE:"CPU usage average\: %lf%%" \
		COMMENT:"	\j" > /dev/null
#
		$rrdtool graph $img/cpu-$period.png -s -1$period -a PNG \
		-Y -r -u 100 -l 0 -L 5 -v "Uso de CPU" -w 497 -h 226 -t "Uso de CPU - "$variable"" \
		-c "BACK#FFFFFF" -c "SHADEA#FFFFFF" -c "SHADEB#FFFFFF" \
		-c "MGRID#AAAAAA" -c "GRID#CCCCCC" -c "ARROW#333333" \
		-c "FONT#333333" -c "AXIS#333333" -c "FRAME#333333" \
		DEF:user=$db:cpuuser:AVERAGE \
		DEF:nice=$db:cpunice:AVERAGE \
		DEF:sys=$db:cpusystem:AVERAGE \
		CDEF:idle=100,user,nice,sys,+,+,- \
		COMMENT:"	" \
		AREA:user\#FF0000:"CPU user" \
		STACK:nice\#000099:"CPU nice" \
		STACK:sys\#FFFF00:"CPU system" \
		STACK:idle\#00FF00:"CPU idle" \
		COMMENT:"	\j" >/dev/null
done


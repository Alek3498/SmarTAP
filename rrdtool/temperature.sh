#!/bin/bash
# temperature.sh - Show CPU Temperatures
# Path to rrdtool:
rrdtool=/usr/bin/rrdtool
# Path to rrdtool database:
db=/opt/SmarTAP/rrdtool/rrd/temperature.rrd
# Path to images:
img=/opt/SmarTAP/webguiSONDAS/webgui/public/imagenes
if [ ! -e $db ]
then 
rrdtool create $db \
	--step 300 \
	DS:temp1:GAUGE:600:0:50 \
	RRA:MAX:0.5:1:288
fi

$rrdtool update $db N:`sensors | grep Core | cut -d":" -f2|awk '{print $1}' | cut -d"°" -f1`

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

$rrdtool graph $img/temperature-$period.png -s -1$period -a PNG \
	-Y -u 1.1 -l 0 -L 5 -w 497 -h 226 -t "Temperatura del CPU - "$variable"" -z \
	-v "Temperatura (°C)" \
	DEF:temp1=$db:temp1:MAX \
	LINE1:temp1#ff0000:"temp Core 0" > /dev/null
done

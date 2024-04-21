#!/bin/bash
# memory.sh - Uso de memoria por RRDTool:
rrdtool=/usr/bin/rrdtool
# Ubicación de la base de datos de RRDTool:
db=/opt/SmarTAP/rrdtool/rrd/memory.rrd
# Ubicación de las imágenes generadas:
img=/opt/SmarTAP/webguiSONDAS/webgui/public/imagenes


if [ ! -e $db ]
then
	$rrdtool create $db \
	DS:usage:GAUGE:600:0:50000000000 \
	RRA:AVERAGE:0.5:1:576 \
	RRA:AVERAGE:0.5:6:672 \
	RRA:AVERAGE:0.5:24:732 \
	RRA:AVERAGE:0.5:144:1460

fi

$rrdtool update $db -t usage N:`free -b |grep Mem:|cut -d":" -f2|awk '{print $2}'`


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

	$rrdtool graph $img/memory-$period.png -s -1$period \
	-t "Uso de Memoria - "$variable"" -z \
	-c "BACK#FFFFFF" -c "SHADEA#FFFFFF" -c "SHADEB#FFFFFF" \
	-c "MGRID#AAAAAA" -c "GRID#CCCCCC" -c "ARROW#333333" \
	-c "FONT#333333" -c "AXIS#333333" -c "FRAME#333333" \
        -h 226 -w 497 -l 0 -a PNG -v "Bytes" \
	DEF:usage=$db:usage:AVERAGE \
	VDEF:min=usage,MINIMUM \
        VDEF:max=usage,MAXIMUM \
        VDEF:avg=usage,AVERAGE \
        VDEF:lst=usage,LAST \
	"COMMENT: \l" \
	"COMMENT:               " \
	"COMMENT:Minimum    " \
	"COMMENT:Maximum    " \
	"COMMENT:Average    " \
	"COMMENT:Current    \l" \
	"COMMENT:   " \
	"AREA:usage#EDA362:Usage  " \
	"LINE1:usage#F47200" \
	"GPRINT:min:%5.1lf %sB   " \
	"GPRINT:max:%5.1lf %sB   " \
	"GPRINT:avg:%5.1lf %sB   " \
	"GPRINT:lst:%5.1lf %sB   \l" > /dev/null

done

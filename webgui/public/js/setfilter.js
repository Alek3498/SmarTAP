const FILTERS_URL="https://"+localStorage.getItem('ipmgmt')+":443/getFilters"
//console.log(FILTERS_URL)
var jsonObjectFilter = { "ALL":[],"vlan": [], "ProtoPort": [],"IPPORT":[]}


function setTraffic(){
    axios.get(FILTERS_URL)
    .then((response)=>{
       // console.log("response del archivo",response)
        for(i in response.data){
            if(response.data[i].length>0 && i=="ALL"){
                excludeFilters(jsonObjectFilter,"ALL")
                jsonObjectFilter.ALL.push("Todo el tráfico")
            }
            if(response.data[i].length>0 && i=="vlan"){
               excludeFilters(jsonObjectFilter,"vlan")
               setVlan(response.data[i][0])
            }
            if(response.data[i].length>0 && i=="ProtoPort"){
                excludeFilters(jsonObjectFilter,"protocolPort")
                setProtoPort(response.data[i][0])
            }
            if(response.data[i].length>0 && i=="IPPORT"){
               excludeFilters(jsonObjectFilter,"IP")
               setIPPORT(response.data[i][0])
            }
        }
        //setJson(jsonObject,jsonObjectFilter)
        addFilters(jsonObjectFilter)
        //setCheckFilters(jsonObjectFilter)
        
    })
}

function setVlan(list){
    list.forEach(element=>jsonObjectFilter.vlan.push("VLAN:"+element))
}

function setProtoPort(list){
    list.forEach(element=>{
    var values=element.split(":")
    if(values[0]=="6" && values[1]!="17"){
        jsonObjectFilter.ProtoPort.push("Protocolo + Puerto:TCP:"+values[1])
    }
    else if(values[0]=="17"){
        jsonObjectFilter.ProtoPort.push("Protocolo + Puerto:UDP:"+values[1])
    }
    else if(values[0]=="1"){
        jsonObjectFilter.ProtoPort.push("Protocolo:ICMP")
    }else if(values[0]=="0"){
        jsonObjectFilter.ProtoPort.push("Puerto:"+values[1]+":"+0)
    }else{
        jsonObjectFilter.ProtoPort.push("Protocolo + Puerto:TCP/UDP:"+values[2])
    }
})
}

function setIPPORT(list){
    list.forEach(element=>{
        var values=element.split(":")
        //IP ORIGEN
        if(values[1]=="0"&& values[2]=="0"){
            let ipOrigen=values[0].split("/")
            arrayIPs.push(ipOrigen[0])
            jsonObjectFilter.IPPORT.push("IP Origen:"+values[0])
        }
        //IP DESTINO
        if(values[0]=="0"&&values[2]=="0"){
            let ipdst=values[1].split("/")
            arrayIPs.push(ipdst[0])
            jsonObjectFilter.IPPORT.push("IP Destino:"+values[1])
        }
        //IP Origen + IP Destino
        if(values[0]!="0" && values[1]!="0" && values[2]=="0"){
            let ipOrigen=values[0].split("/")
            let ipdst=values[1].split("/")
            arrayIPs.push(ipOrigen[0],ipdst[0])
            jsonObjectFilter.IPPORT.push("IP Origen + IP Destino:"+values[0]+":"+values[1])
        }
        //IP Origen + Puerto
        if(values[0]!="0" && values[1]=="0" && values[2]!="0"){
            let ipOrigen=values[0].split("/")
            arrayIPs.push(ipOrigen[0])
            jsonObjectFilter.IPPORT.push("IP Origen + Puerto:"+values[0]+":"+values[2])
        }
        //IP DESTINO + PUERTO
        if(values[0]=="0" && values[1]!="0" && values[2]!="0"){
            let ipdst=values[1].split("/")
            arrayIPs.push(ipdst[0])
            jsonObjectFilter.IPPORT.push("IP Destino + Puerto:"+values[1]+":"+values[2])
        }
        //IP DESTINO + IP Origen + Puerto
        if(values[0]!="0" && values[1]!="0" && values[2]!="0"){
            let ipOrigen=values[0].split("/")
            let ipdst=values[1].split("/")
            arrayIPs.push(ipOrigen[0],ipdst[0])
            jsonObjectFilter.IPPORT.push("IP Origen + IP Destino + Puerto:"+values[0]+":"+values[1]+":"+values[2])
        }
    })

}

function setCheckFilters(jsonObjectFilter){
    $('input:checkbox[name=filtersvalues]:checked').each(function(){
        let values=($(this).val());
        let element=($(this))
        let newElement=document.createElement("i")
        newElement.setAttribute("class","fas fa-check")
        element.after(newElement)
})
}



setTraffic()

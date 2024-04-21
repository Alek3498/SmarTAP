var jsonObject = { "ALL":"","vlan": [], "ProtoPort": [],"IPPORT":[]}
const API_FILTERS="https://"+localStorage.getItem('ipmgmt')+":443/filters"
const DELETE_FILTERS="https://"+localStorage.getItem('ipmgmt')+":443/deleteALL"
//Function to send filters and write file config
function sendFilters(){
    //notcheckInput()
    applyFilters()
}

/******************Functions********************/
function validateProtocol(value) {
    if (value == "TCP") {
      return 6;
    } else if (value == "UDP") {
      return 17
    } else if (value == "ICMP") {
      return 1
    }
  }
function cleanFilters(){
    jsonObject.vlan=[]
    jsonObject.IPPORT=[]
    jsonObject.ProtoPort=[]
}


function clearJson(jsonapi,jsonObjectFilter){
    jsonObject.ALL=""
    jsonObject.vlan=[]
    jsonObject.IPPORT=[]
    jsonObject.ProtoPort=[]
    jsonObjectFilter.ALL=[]
    jsonObjectFilter.vlan=[]
    jsonObjectFilter.ProtoPort=[]
    jsonObjectFilter.IPPORT=[]
}

function clearAllRules(){
    Swal.fire({
        title:'¿Está seguro?',
        text:"Esto eliminará todas las reglas actualmente aplicadas",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI'
      }).then((result) => {
        if (result.value) {
            $('input:checkbox[name=filtersvalues]').each(function(){
                let values=($(this).val());
                let parentNode=($(this).parent());
                parentNode[0].remove()
                clearJson(jsonObject,jsonObjectFilter)
            })
          axios.get(DELETE_FILTERS)
          .then( response => {
              Swal.close();
              Swal.fire(
                  'Operación exitosa',
                  'Las reglas han sido eliminadas',
                  'success'
              )
          })
          .catch( e => {
            Swal.close();
            error_popup();
          })
          
        }
      })
}







function deleteFilters(){
    $('input:checkbox[name=filtersvalues]:checked').each(function(){
        //console.log("json object filters ",jsonObjectFilter)
        let values=($(this).val());
        let parentNode=($(this).parent());
        parentNode[0].remove()
        if(values=="Todo el tráfico"){
            jsonObjectFilter.ALL=""
            Swal.fire(
                'Operación exitosa',
                'Filtro eliminado, recuerde aplicar los filtros para aplicar los cambios',
                'success'
            )
        }
        else{
        var arrayvalues=values.split(":")
        var value=arrayvalues[0]
        var valueIP=arrayvalues[1].split("/")
        if(value=="VLAN"){
        jsonObjectFilter.vlan=jsonObjectFilter.vlan.filter(function(value){
            return value!=values
        })
        }else if(value=="Protocolo + Puerto" || value=="Protocolo" || value=="Puerto"){
            jsonObjectFilter.ProtoPort=jsonObjectFilter.ProtoPort.filter(function(value){
                return value!=values
            })
        }
        else{
            deleteIPValidation(valueIP[0])
            jsonObjectFilter.IPPORT=jsonObjectFilter.IPPORT.filter(function(value){
            return value!=values
            })
            
        }
        Swal.fire(
            'Operación exitosa',
            'Filtro eliminado, recuerde aplicar filtros para aplicar los cambios',
            'success'
        )
        }
    
    })
          

    }
function deleteIPValidation(ip){
    arrayIPs=arrayIPs.filter(function(value){
        var ip=value.split("/")
        return ip[0]!=ip
    })
}

function notcheckInput(){
    var arrayObject={"VLAN":[]}
    $('input:checkbox:not(:checked)').each(function(){
        let values=($(this).val());
        var arrayvalues=values.split(":")
        var value=arrayvalues[0]
        let parentNode=($(this).parent());
        parentNode[0].remove()
        if(value=="VLAN"){
           arrayObject.VLAN.push(arrayvalues[1])
        }else if(value=="Protocolo + Puerto" || value=="Protocolo"){
            jsonObjectFilter.ProtoPort=jsonObjectFilter.ProtoPort.filter(function(value){
                return value!=values
            })
        }
        else{
            jsonObjectFilter.IPPORT=jsonObjectFilter.IPPORT.filter(function(value){
            return value!=values
            })
        }
        
    
    })
}


function applyFilters(){
    var jsonObject = { "ALL":"","vlan": [], "ProtoPort": [],"IPPORT":[]}
    $('input:checkbox[name=filtersvalues]:checked').each(function(){
    let values=($(this).val());
    let element=($(this))
   //let newElement=document.createElement("i")
   //newElement.setAttribute("class","fas fa-check")
    //element.after(newElement)
    //ALL Trafico
    if(values=="Todo el tráfico"){
        jsonObject.ALL=1
    }
    
    var arrayValues=values.split(":")
    //console.log("arrayvalues ",arrayValues)
    if(arrayValues[0]=="VLAN"){
        jsonObject.vlan.push(arrayValues[1])

    }else if(arrayValues[0]=="Protocolo + Puerto"){
        var protocolNumber=validateProtocol(arrayValues[1])
        if(arrayValues[1]=="TCP/UDP"){
            protocolNumber=6+":"+17
        }
        jsonObject.ProtoPort.push(protocolNumber+":"+arrayValues[2])

    }else if(arrayValues[0]=="Protocolo"){
        var protocolNumber=validateProtocol(arrayValues[1])
        jsonObject.ProtoPort.push(protocolNumber+":"+0)

    }else if(arrayValues[0]=="Puerto"){
        jsonObject.ProtoPort.push(0+":"+arrayValues[1])

    }else if(arrayValues[0]=="IP Origen"){
        jsonObject.IPPORT.push(arrayValues[1]+":"+0+":"+0)

    }else if(arrayValues[0]=="IP Destino"){
        jsonObject.IPPORT.push(0+":"+arrayValues[1]+":"+0)

    }else if(arrayValues[0]=="IP Origen + IP Destino"){
        jsonObject.IPPORT.push(arrayValues[1]+":"+arrayValues[2]+":"+0)

    }else if(arrayValues[0]=="IP Origen + Puerto"){
        jsonObject.IPPORT.push(arrayValues[1]+":"+0+":"+arrayValues[2])

    }else if(arrayValues[0]=="IP Destino + Puerto"){
        jsonObject.IPPORT.push(0+":"+arrayValues[1]+":"+arrayValues[2])
    
    }else if(arrayValues[0]=="IP Origen + IP Destino + Puerto"){
        jsonObject.IPPORT.push(arrayValues[1]+":"+arrayValues[2]+ ":" + arrayValues[3])
    
    }
})
    
    postAPI(jsonObject)
    cleanFilters()
}


function postAPI(json){
    //console.log("json a enviar!!",json)
    if(isEmpty(json)){
        Swal.fire({
            icon: 'error',
            title: 'No hay filtro para aplicar',
            text: 'Aplicar al menos un filtro'
          })
    }else{
    axios.post(API_FILTERS,json)
    .then((response)=>{
        Swal.fire(
            'Operación exitosa',
            'Filtro aplicado',
            'success'
          )
    })
    .catch((error)=>{
        alert("error")
    })
    }
    
}
//Se recorre el array y se verifica que hayan elementos
function isEmpty(json){
    //console.log("json recibido",json)
    cont=0
    for(var i in json){
        //console.log("tamanio",json[i].length)
        if(json[i].length==0){
            //console.log("es 0")
            cont+=1
        }
    }
    if(cont==4){
        //console.log("es 3!")
    }
    return cont==4
    }



    
    




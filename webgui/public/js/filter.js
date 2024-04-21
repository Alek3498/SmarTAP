/******************Variables Globales********************/
var filtro = document.getElementById("filtersID")
var clean = document.getElementById("resetsfilters")
var buttonfilter = document.getElementById("buttonfilter")
var buttondelete = document.getElementById("buttondelete")
var cardFilter = document.getElementById("cardFIlters")
var divFilter=document.createElement("div")
divFilter.setAttribute("id","filtersInputs")
var label=document.createElement("label")
var input=document.createElement("input")
/*JsonObject to set config file and execute script bash*/
var arrayValues=[]
/******************Events********************/
$('#inputGroup').change(function () {
  switch ($(this).val()) {
    case 'ALL':
      $('#ALL-ID').css({ 'display': 'inline' });
      $('#VLAN-ID').css({ 'display': 'none' });
      $('#PROTOPORT-ID').css({ 'display': 'none' })
      $('#IP-ID').css({ 'display': 'none' });
      $('#IP-SRC').css({ 'display': 'none' });
      break;
    case 'VLAN':
      $('#VLAN-ID').css({ 'display': 'inline' });
      $('#PROTOPORT-ID').css({ 'display': 'none' })
      $('#IP-ID').css({ 'display': 'none' });
      $('#IP-SRC').css({ 'display': 'none' });
      $('#Port-Dest').css({ 'display': 'none' });
      $('#ALL-ID').css({ 'display': 'none' });
      break;
    case 'PROTOPORT':
      $('#PROTOPORT-ID').css({ 'display': 'inline' });
      $('#VLAN-ID').css({ 'display': 'none' });
      $('#IP-ID').css({ 'display': 'none' });
      $('#IP-SRC').css({ 'display': 'none' });
      $('#Port-Dest').css({ 'display': 'none' });
      $('#ALL-ID').css({ 'display': 'none' });
      break;
    case 'IP':
      $('#IP-ID').css({ 'display': 'inline' });
      $('#IP-SRC').css({ 'display': 'inline' });
      $('#Port-Dest').css({ 'display': 'inline' });
      $('#VLAN-ID').css({ 'display': 'none' });
      $('#PROTOPORT-ID').css({ 'display': 'none' });
      $('#ALL-ID').css({ 'display': 'none' });
      break;
    default:
      $('#VLAN-ID').css({ 'display': 'inline' });
      break;
  }
})
/******************Function validations********************/
function isValidIP(str) {
  let regex = /([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}\/\d+/
  return regex.test(str)
}

function validateIP(arrayvalues,addr){
  var ip=addr.split("/")
  if(!isValidIP(addr)){
    Swal.fire({
      type: 'error',
      title: 'Ingreso invalido',
      text: 'Debe ingresar una IP valida desde 0.0.0.0 y 254.254.254.254/1-32'
    })
    return false
  }
  /*else if(validateExist(arrayvalues,ip[0])){
    Swal.fire({
      type: 'error',
      title: 'Ingreso invalido',
      text: 'La direccion IP: '+ip[0]+' ya se encuentra filtrada'+'\n'+'Elimine la dirección IP e intente nuevamente'
    })
    return false
    
  }
  */
  else{
    return true;
  }

}

function validateIPSRDST(array,ipsrc,ipdst){
  var iporigen=ipsrc.split("/")
  var ipdestino=ipdst.split("/")
  if(iporigen[0]==ipdestino[0]){
    Swal.fire({
      type: 'error',
      title: 'Ingreso invalido',
      text: 'La direccion Origen no puede ser igual a la direccion Destino'
    })
    return false
  }
  else if(!isValidIP(ipsrc) || !isValidIP(ipdst)){
    Swal.fire({
      type: 'error',
      title: 'Ingreso invalido',
      text: 'Debe ingresar una IP valida desde 0.0.0.0 y 254.254.254.254/1-32'
    })
    return false
  }
  /*else if(validateExist(array,iporigen[0])){
    Swal.fire({
      type: 'error',
      title: 'Ingreso invalido',
      text: 'La direccion IP ingresada'+iporigen[0]+' ya se encuentra filtrada'+'\n'+'Elimine la dirección IP e intente nuevamente'
    })
    return false

  }
  */
  /*else if (validateExist(array,ipdestino[0])){
    Swal.fire({
      type: 'error',
      title: 'Ingreso invalido',
      text: 'La direccion IP ingresada'+ipdestino[0]+' ya se encuentra filtrada'+'\n'+'Elimine la dirección IP e intente nuevamente'
    })
    return false
  }
  */
  else{
    return true
  }
}

function validateIPPort(array,ip,port){
  var ipaddr=ip.split("/")
  if(!isValidIP(ip)){
    Swal.fire({
      type: 'error',
      title: 'Ingreso invalido',
      text: 'Debe ingresar una IP valida desde 0.0.0.0 y 254.254.254.254/1-32 '
    })
    return false
  }
  else if(port<1 || port>65535 || isNaN(port)){
    Swal.fire({
      type: 'error',
      title: 'Ingreso invalido',
      text: 'Puerto debe estar entre 1 y 65535'
    })
    return false

  }
  /*else if(validateExist(array,ipaddr[0])){
    Swal.fire({
      type: 'error',
      title: 'Ingreso invalido',
      text:  'La direccion IP ingresada: '+ipaddr[0]+' ya se encuentra filtrada'+'\n'+'Elimine la dirección IP e intente nuevamente'
    })
    return false
  }
  */
  else{
    return true
  }
}

function validateIPSRCDSTPORT(array,srcip,ipdst,port){
  var iporigen=srcip.split("/")
  var ipdestino=ipdst.split("/")

  if(iporigen[0]==ipdestino[0]){
    Swal.fire({
      type: 'error',
      title: 'Ingreso invalido',
      text: 'La direccion Origen no puede ser igual a la direccion Destino'
    })
    return false
  }
  else if(!isValidIP(srcip) || !isValidIP(ipdst)){
    Swal.fire({
      type: 'error',
      title: 'Ingreso invalido',
      text: 'Debe ingresar una IP valida desde 0.0.0.0 y 254.254.254.254/1-32 '
    })
    return false
  }
  /*else if(validateExist(array,iporigen[0])){
    Swal.fire({
      type: 'error',
      title: 'Ingreso invalido',
      text: 'La direccion IP ingresada'+iporigen[0]+' ya se encuentra filtrada'+'\n'+'\n'+'Elimine la dirección IP e intente nuevamente'
    })
    return false

  }else if (validateExist(array,ipdestino[0])){
    Swal.fire({
      type: 'error',
      title: 'Ingreso invalido',
      text: 'La direccion IP ingresada'+ipdestino[0]+' ya se encuentra filtrada'+'\n'+'Elimine la dirección IP e intente nuevamente'
    })
    return false
  }
  */else if(port<1 || port>65535 || isNaN(port)){
    Swal.fire({
      type: 'error',
      title: 'Ingreso invalido',
      text: 'Puerto debe estar entre 1 y 65535'
    })
    return false

  }else{
    return true
  }

}


function validateProtocol(value) {
  if (value == "TCP") {
    return 6;
  } else if (value == "UDP") {
    return 17
  } else if (value == "ICMP") {
    return 1
  }else if(value=="TCP/UDP"){
    return "6:17"
  }
}
/******************FILTERS FUNCTIONS********************/
function excludeFilters(filters,value){
 if(value=="vlan"){
   filters.ProtoPort=[]
   filters.IPPORT=[]
   filters.ALL=[]
 }
 if(value=="protocolPort"){
   filters.vlan=[]
   filters.IPPORT=[]
   filters.ALL=[]
 }
 if(value=="IP"){
   filters.vlan=[]
   filters.ProtoPort=[]
   filters.ALL=[]
 }
 if(value=="ALL"){
  filters.vlan=[]
  filters.ProtoPort=[]
  filters.IPPORT=[]
 }
}


function addFilters(filtersObject){
  //Refresh del input
  $("#filtersInputs").empty();
  let box = document.getElementById("cards")
  for(i in filtersObject){
    if(filtersObject[i].length>0){
      for(var x=0;x<filtersObject[i].length;x++){
        var div=document.createElement("div")
        div.setAttribute("class","class-filter")
        var label=document.createElement("label")
        var input=document.createElement("input")
        input.type="checkbox"
        input.name="filtersvalues"
        input.setAttribute("checked","checked")
        input.setAttribute("id",i+"id")
        input.value=filtersObject[i][x]
        label.textContent=filtersObject[i][x]
        div.appendChild(label)
        div.appendChild(input)
        divFilter.appendChild(div)
        box.appendChild(divFilter)
      }
    }
  }
}

//Validar si existe en el box de los filtros,a traves de una busqueda secuencial
function validateExist(array, value) {
  var exist = false
  let i = 0
  while (i <= array.length && !exist) {
    if (array[i] == value) {
      exist = true
    }
    i += 1
  }
  return exist

}
//Setea los filtros de forma excluyente y los agrega al ArrayObject
function setFilter(jsonobject,value,arrayvalue){
  excludeFilters(jsonobject,value)
  addFilters(jsonobject)
  buttonfilter.style.display = "inline"
  buttondelete.style.display="inline"
  clean.style.display = "inline"
}

/******************Filters Functions********************/

function filtersVlan(){
  let idvlan = document.getElementById("idvlan").value
  if (idvlan && idvlan >= 1 && idvlan <= 4094 && !validateExist(jsonObjectFilter.vlan,"VLAN:"+idvlan)){
    jsonObjectFilter.vlan.push("VLAN:"+idvlan)
    setFilter(jsonObjectFilter,"vlan",arrayValues)
    return true

  } else if (validateExist(jsonObjectFilter.vlan,"VLAN:"+idvlan)) {
    Swal.fire({
      type: 'Error',
      title: 'Ingreso invalido',
      text: 'N° de vlan ya se encuentra filtrado'
    })
    return false
  } else {
    Swal.fire({
      type: 'error',
      title: 'Ingreso invalido',
      text: 'Debe ingresar un valor entre 1 y 4094'
    })
    return false
  }
}

function filtersProto() {
  let port = document.getElementById("protoIP").value
  let proto = $('#inputGroupSelect01').val()
  //ICMP
  if (proto == "ICMP" && !validateExist(jsonObjectFilter.ProtoPort,"Protocolo:"+proto)){
    jsonObjectFilter.ProtoPort.push("Protocolo:"+proto)
    setFilter(jsonObjectFilter,"protocolPort")
    return true
  }else if (validateExist(jsonObjectFilter.ProtoPort,"Protocolo:"+proto)){
    showMessageError()
    return false
  }
  //Protocolo + Puerto 
  if(port && proto && proto!="NULL" && !validateExist(jsonObjectFilter.ProtoPort,"Protocolo + Puerto:"+proto+":"+port)) {
    jsonObjectFilter.ProtoPort.push("Protocolo + Puerto:"+proto+":"+port)
    setFilter(jsonObjectFilter,"protocolPort")
    return true
     
  
  }else if(validateExist(jsonObjectFilter.ProtoPort,"Protocolo + Puerto:"+proto+":"+port)){
    showMessageError()
    return false

  //PORT
  }if(port && !isNaN(port) && port >= 0 && port < 65535 && proto=="NULL" && !validateExist(jsonObjectFilter.ProtoPort,"Puerto:"+port+":"+0)){
    proto.value=""
    jsonObjectFilter.ProtoPort.push("Puerto:"+port+":"+0)
    setFilter(jsonObjectFilter,"protocolPort")
    return true


  }else if(validateExist(jsonObjectFilter.ProtoPort,"Puerto:"+port+":"+0)){
    showMessageError()
    return false

  }else {
    Swal.fire({
      type: 'error',
      title: 'Ingreso invalido',
      text: 'Debe ingresar un valor entre 0 y 65535'
    })
    return false
  }

}

function showMessageError(){
  Swal.fire({
    type: 'error',
    title: 'Ingreso invalido',
    text: 'Combinacion ya existe'
  })
}

function filtersIP() {
  var SRCIP = document.getElementById("ip").value
  var ipDest = document.getElementById("ipDest").value
  var portDest=document.getElementById("Port-DestID").value
  
  //IP ORIGEN
  if(SRCIP&& !ipDest && !portDest && validateIP(arrayIPs,SRCIP)) {
    arrayValues=[]
    arrayValues.push(SRCIP+":"+0+":"+0)
    let ipOrigen=SRCIP.split("/")
    arrayIPs.push(ipOrigen[0])
    jsonObjectFilter.IPPORT.push("IP Origen:"+SRCIP)
    setFilter(jsonObjectFilter,"IP")
  

  //IP DESTINO
  }if(!SRCIP && ipDest && !portDest && validateIP(arrayIPs,ipDest)){
      arrayValues=[]
      arrayValues.push(0+":"+ipDest+":"+0)
      let ipdestino=ipDest.split("/")
      arrayIPs.push(ipdestino[0])
      jsonObjectFilter.IPPORT.push("IP Destino:"+ipDest)
      setFilter(jsonObjectFilter,"IP")
      return true
  }
  //IP ORIGEN + IP DESTINO
  if(SRCIP && ipDest &&!portDest && validateIPSRDST(arrayIPs,SRCIP,ipDest)){
    arrayValues=[]
    arrayValues.push(SRCIP+":"+ipDest+":"+0)
    let iporigen=SRCIP.split("/")
    let ipdestino=ipDest.split("/")
    arrayIPs.push(iporigen[0],ipdestino[0])
    jsonObjectFilter.IPPORT.push("IP Origen + IP Destino:"+SRCIP+":"+ipDest)
    setFilter(jsonObjectFilter,"IP")
    return true
  }
  //IP Origen + PUERTO
  if(SRCIP && !ipDest && portDest && validateIPPort(arrayIPs,SRCIP,portDest)){
    arrayValues=[]
    arrayValues.push(SRCIP+":"+0+":"+portDest)
    let iporigen=SRCIP.split("/")
    arrayIPs.push(iporigen[0])
    jsonObjectFilter.IPPORT.push("IP Origen + Puerto:"+SRCIP+":"+portDest)
    setFilter(jsonObjectFilter,"IP")
    return true
  }  
  //IP DESTINO + PUERTO
  if(!SRCIP && ipDest && isValidIP(ipDest) && portDest && validateIPPort(arrayIPs,ipDest,portDest)){
    arrayValues=[]
    arrayValues.push("0"+":"+ipDest+":"+0)
    let ipdestino=ipDest.split("/")
    arrayIPs.push(ipdestino[0])
    jsonObjectFilter.IPPORT.push("IP Destino + Puerto:"+ipDest+":"+portDest)
    setFilter(jsonObjectFilter,"IP")
    return true
  }
  //IP DESTINO + IP Origen + Puerto
  if(SRCIP && ipDest && portDest && validateIPSRCDSTPORT(arrayIPs,SRCIP,ipDest,portDest)){
    arrayValues=[]
    arrayValues.push(SRCIP+":"+ipDest+":"+portDest)
    let iporigen=SRCIP.split("/")
    let ipdestino=ipDest.split("/")
    arrayIPs.push(iporigen[0],ipdestino[0])
    jsonObjectFilter.IPPORT.push("IP Origen + IP Destino + Puerto:"+SRCIP+":"+ipDest+ ":" + portDest)
    setFilter(jsonObjectFilter,"IP")
    return true

  }
  else{
    return false
  }
}

 

function filtersALL() {
  if(!validateExist(jsonObjectFilter.ALL,"Todo el tráfico")){
  jsonObjectFilter.ALL.push("Todo el tráfico")
  setFilter(jsonObjectFilter,"ALL")
  return true
}else{
  Swal.fire({
    type: 'error',
    title: 'Ingreso invalido',
    text: 'Ya está filtrando todo el tráfico'
  })
  return false
}
}

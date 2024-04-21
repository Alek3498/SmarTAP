
/******************Variables Globales********************/
var ethtunnel="eth0"
const API_TUNNEL="https://"+localStorage.getItem('ipmgmt')+":443/tunnel"
//console.log("json api en el tunnel js",jsonTunnelAPI)
//console.log("jsontunnel en tunnle.js",jsontunnel,"jsonmgmt",jsonMGMT)
$("#inputGroupSelect05").on("change",function(){
    ethtunnel=$(this).val();
    validateChanges(ethtunnel)
  })
  
  function validateChanges(ethtunnel){
    if(ethtunnel=="eth0"){
       $("#address-tunnel").css({"display":"none"})
       $("#mask-tunnel").css({"display":"none"})
       $("#gw-tunnel").css({"display":"none"})
    }else{
      $("#address-tunnel").css({"display":"inline"})
      $("#mask-tunnel").css({"display":"inline"})
      $("#gw-tunnel").css({"display":"inline"})    
    }
  }
  function validateIp(ip) {
    var patronIp = new RegExp("^([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})$");
    var valores;
  
    // early return si la ip no tiene el formato correcto.
    if(ip.search(patronIp) !== 0) {
      return false
    }
    valores = ip.split("."); 
    return valores[0] <= 255 && valores[1] <= 255 && valores[2] <= 255 && valores[3] <= 255
  }
  
  function validateMask(mask){
    var patron=new RegExp("^(((255\.){3}(255|254|252|248|240|224|192|128|0+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))$");
    return patron.test(mask)
  }
  
  function showConfigMGMT(jsonobject){
    let boxmgmt = document.getElementById("boxMGMTFilter")
    $('#boxMGMTFilter > li').remove();
    for(i in jsonobject){
      var input=document.createElement("div")
      var li=document.createElement("li")
      if(jsonobject[i]){
      li.setAttribute("class","list-group-item")
      li.setAttribute("id","settingApply")
      li.textContent=i+":"+jsonobject[i]
      boxmgmt.appendChild(li)
      }
    }

  }

  function showConfig(jsonobject){
    let boxTunnel = document.getElementById("boxTunnelFilter")
    $('#boxTunnelFilter > li').remove();
    for(i in jsonobject){
      var input=document.createElement("div")
      var li=document.createElement("li")
      if(jsonobject[i]){
      li.setAttribute("class","list-group-item")
      li.setAttribute("id","settingApply")
      li.textContent=i+":"+jsonobject[i]
      boxTunnel.appendChild(li)
      }
    }
  }

  function applyFiltermgmt(){
    if(validateIp($("#address-mgmt").val())&&validateMask($("#mask-mgmt").val())&&validateIp($("#gw-mgmt").val())){
      jsonMGMT.InterfazMGMT="eth0"
      jsonMGMT.DireccionManagment=$("#address-mgmt").val()
      jsonMGMT.GatewayManagment=$("#gw-mgmt").val()
      jsonMGMT.MascaraManagment=$("#mask-mgmt").val()
      sendConfig()
      showConfigMGMT(jsonMGMT)
    }else if(!validateMask($("#mask-mgmt").val())){
      Swal.fire({
        icon: 'error',
        title: 'Ingreso invalido',
        text: 'Error de formato de mascara, ejemplo: 255.255.255.0'
      })
    
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Ingreso invalido',
        text: 'Debe ingresar una IP valida desde 0.0.0.0 y 254.254.254.254'
      })

    }
  }

  function applyFilter(){
    let valueEth=ethtunnel
    $("#buttonTunnelFilter").css({"display":"inline"})
    var srcTunnel=$("#src-tunnel").val()
    if(valueEth=="eth0"){
      if(addfilterConfig(valueEth)){
        sendConfig()
      }
    }else{
      if(addTunelConfig(valueEth)){
        sendConfig()
      }
    }

  }


  function addfilterConfig(tunel){
    var check=false
    if(validateIp($("#src-tunnel").val())&& validateIp($("#dest-tunnel").val()) && $("#src-tunnel").val()!=$("#dest-tunnel").val() ){
      check=true
      jsontunnel.InterfazTunnel=tunel
      jsontunnel.IPOrigenTunel=$("#src-tunnel").val()
      jsontunnel.IPDestinoTunel=$("#dest-tunnel").val()
      jsontunnel.DireccionTunel=""
      jsontunnel.MascaraTunel=""
      jsontunnel.GatewayTunel=""
      showConfig(jsontunnel)
    }else if($("#src-tunnel").val()==$("#dest-tunnel").val()){
      Swal.fire({
        icon: 'error',
        title: 'Ingreso invalido',
        text: 'IP Origen no puede ser igual a IP Destino'
      })
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Ingreso invalido',
        text: 'Debe ingresar una IP valida desde 0.0.0.0 y 254.254.254.254'
      })
    }
    return check
  }
  function addTunelConfig(tunel){
    var check=false
    if(validateIp($("#src-tunnel").val())&& validateIp($("#dest-tunnel").val())&& validateMask($("#mask-tunnelInput").val()) &&validateIp($("#address-tunnelInput").val())&& validateIp($("#gw-tunnelInput").val()) && $("#src-tunnel").val()!=$("#dest-tunnel").val()){
      check=true
      jsontunnel.InterfazTunnel=tunel
      jsontunnel.IPOrigenTunel=$("#src-tunnel").val()
      jsontunnel.IPDestinoTunel=$("#dest-tunnel").val()
      jsontunnel.DireccionTunel=$("#address-tunnelInput").val()
      jsontunnel.MascaraTunel=$("#mask-tunnelInput").val()
      jsontunnel.GatewayTunel=$("#gw-tunnelInput").val()
      showConfig(jsontunnel)
    }else if($("#src-tunnel").val()==$("#dest-tunnel").val()){
      Swal.fire({
        icon: 'error',
        title: 'Ingreso invalido',
        text: 'IP Origen no puede ser igual a IP Destino'
      })
    }else if(!validateMask($("#mask-tunnelInput").val())){
      Swal.fire({
        icon: 'error',
        title: 'Ingreso invalido',
        text: 'Error de formato de mascara, ejemplo: 255.255.255.0'
      })
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Ingreso invalido',
        text: 'Debe ingresar una IP valida desde 0.0.0.0 y 254.254.254.254'
      })
    }
    return check
  }

  function sendConfig(){
    jsonTunnelAPI.TUNIF=jsontunnel.InterfazTunnel
    jsonTunnelAPI.TUNDST=jsontunnel.IPDestinoTunel
    jsonTunnelAPI.TUNSRC=jsontunnel.IPOrigenTunel
    jsonTunnelAPI.TUNADDR=jsontunnel.DireccionTunel
    jsonTunnelAPI.TUNMASK=jsontunnel.MascaraTunel
    jsonTunnelAPI.TUNGW=jsontunnel.GatewayTunel
    jsonTunnelAPI.MGTIF="eth0"
    jsonTunnelAPI.MGTADDR=jsonMGMT.DireccionManagment
    jsonTunnelAPI.MGTMASK=jsonMGMT.MascaraManagment
    jsonTunnelAPI.MGTGW=jsonMGMT.GatewayManagment
    //console.log("jsonTunnelAPI",jsonTunnelAPI)
    if(!jsonTunnelAPI.MGTIF || !jsonTunnelAPI.MGTADDR || !jsonTunnelAPI.MGTMASK || !jsonTunnelAPI.MGTGW){
      Swal.fire({
        type: 'error',
        title: 'Ingreso invalido',
        text: 'Ocurrió un error con las direcciones de gestión',
        footer: '<a href="http://www.daitek.com.ar/index.php#contacto">Contactar a soporte daitek</a>'
      })
    }
    else if(!jsonTunnelAPI.TUNIF ||!jsonTunnelAPI.TUNDST || !jsonTunnelAPI.TUNSRC ){
      Swal.fire({
        type: 'error',
        title: 'Ingreso invalido',
        text: 'Ocurrió un error con las direcciones de túnel',
        footer: '<a href="http://www.daitek.com.ar/index.php#contacto">Contactar a soporte daitek</a>'
      })
    }
    else{
      
    axios.post(API_TUNNEL,jsonTunnelAPI)
    .then(function(response){
      Swal.fire(
        'Operación exitosa',
        'Configuracion aplicado',
        'success'
      )
    })
    .catch(function(error){
      alert("ERROR 500");
    })
  }
}

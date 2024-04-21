const MGMT_URL="https://"+localStorage.getItem('ipmgmt')+":443/tunnelconf"

function setValues(){
  axios.get(MGMT_URL)
  .then((response)=>{
   // console.log("en el setvaluesmgmt",jsonTunnelAPI)
    setJsonTunnel(response.data)
    setJsonconfig(response.data)
    setElement($("#inputGroupSelect05").val(),response.data.tunif)
    $("#src-tunnel").val(response.data.ipsrc)
    $("#dest-tunnel").val(response.data.ipdst)
    $("#address-tunnelInput").val(response.data.iptunn)
    $("#mask-tunnelInput").val(response.data.masktunn)
    $("#gw-tunnelInput").val(response.data.gwtunn)
    $("#address-mgmt").val(response.data.ipmgmt)
    $("#gw-mgmt").val(response.data.gwmgmt)
    $("#mask-mgmt").val(response.data.maskmgmt)
  })

}
//Llena el objeto json con la configuración actual
function setJsonTunnel(json){
  jsonTunnelAPI.TUNIF=json.tunif
  jsonTunnelAPI.TUNDST=json.ipdst
  jsonTunnelAPI.TUNSRC=json.ipsrc
  jsonTunnelAPI.TUNADDR=json.iptunn
  jsonTunnelAPI.TUNMASK=json.masktunn
  jsonTunnelAPI.TUNGW=json.gwtunn
  jsonTunnelAPI.MGTIF="eth1"
  jsonTunnelAPI.MGTADDR=json.ipmgmt
  jsonTunnelAPI.MGTMASK=json.maskmgmt
  jsonTunnelAPI.MGTGW=json.gwmgmt
}

//setea los json que cargaran el json api
function setJsonconfig(json){
  jsontunnel.InterfazTunnel=json.tunif
  jsonMGMT.InterfazMGMT="eth0"
  jsontunnel.IPDestinoTunel=json.ipdst
  jsontunnel.IPOrigenTunel=json.ipsrc
  jsontunnel.DireccionTunel=json.iptunn
  jsontunnel.MascaraTunel=json.masktunn
  jsontunnel.GatewayTunel=json.gwtunn
  jsonMGMT.DireccionManagment=json.ipmgmt
  jsonMGMT.GatewayManagment=json.gwmgmt
  jsonMGMT.MascaraManagment=json.maskmgmt
}

function setElement(id,value){
  let element=document.getElementById(id)
  $("#inputGroupSelect05").val(value)
  setChange($("#inputGroupSelect05").val())
  
}

function setChange(value){
  ethtunnel=value
  validateChanges(ethtunnel)
}

setValues()

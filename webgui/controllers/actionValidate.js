let fs=require('fs')
var LogObject={"content":[]}

function writeLog(date,user,index,ip){
console.log("INDEX de log ",index)
LogObject["content"]=[]
if(index!="getFiltersGET"){
var json={
    TimeStamp:date,
    ip:ip,
    user:user,
    action:ACTIONS[index]
}
console.log("objeto json ",json)
LogObject["content"].push(json)
console.log("antes de escribir ",LogObject)
for(var i=0;i<LogObject["content"].length;i++){
    fs.appendFile('../../logs/user.logs',JSON.stringify(LogObject["content"][i])+'\n',function(err){
        if(err){
         console.error(err)
        }
    })
}
}


}

const ACTIONS = {
    postLOGIN:"Accedió a la plataforma",
    filtersGET:"Accedio a seccion de filtros",
    deleteALLGET:"Eliminó todos los filtros",
    tunnelGET:"Accedió a la sección de configuración de túnel",
    tunnelPOST:"Aplicó cambios en la configuración de túnel",
    filtersPOST:"Aplicó cambios en la configuración de filtros",
    statusGET:"Accedió a la estadísticas de interfaces",
    newUserGET:"Accedió a crear un usuario",
    newUserPOST:"Creó un nuevo usuario",
    logUserGET:"Verificó auditoría de usuario",
    listUserGET:"Verificó el listado actual de usuarios",
    deleteUserPOST:"Eliminó un usuario",
    mgmtGET:"Accedió a la sección de configuración de túnel",
    mgmtPOST:"Aplicó cambios en la configuración de gestión"



}

module.exports={
    writerLog:writeLog
}

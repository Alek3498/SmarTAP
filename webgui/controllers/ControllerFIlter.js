let fs=require('fs')
let readline=require('readline')
var path=require('path')
const lineReader = require('line-reader');
var cp=require('child_process')
const { stdout, stderr } = require('process')
let controllermgmt=require('../controllers/ControllerMGMT');
const { json } = require('body-parser');

var jsonFilter = { "ALL":[],"vlan": [], "ProtoPort": [],"IPPORT":[]}

function writer(filters){
    var text=""
    cadena=filters.split("\n")
    console.log("cadena es ",cadena)
    for(i=0;i<cadena.length;i++){
        if(!cadena[i].includes("( )")){
            text+=cadena[i].split(",").join(" ")+"\n"
        
        }
    }
    console.log("texto es",text)

    fs.writeFile('../../conf/rules.cfg',text,function(err){
        if(err){
         console.error(err)
        }else{
        let data=fs.readFileSync(path.join("../../conf/rules.cfg"),'utf-8')
        console.log("archivo seteado...",data)
         executeFIlterBash()
        }
    fs.writeFile('./backup/backup.cfg',text,function(err){
        if(err){
            console.log(err)
        }
    })

 })
}

function writeTunnel(text,filters){
    var json=""
    controllermgmt.getMGMT().then((val)=>
    {json=val,
    fs.writeFile('../../conf/net.cfg',text,function(err){

        if(err){
            console.error(err)
        }else{
            if((filters.MGTADDR!=json.ipmgmt|| filters.MGTGW!=json.gwmgmt|| filters.MGTMASK!=json.maskmgmt) && validateTunn(filters,json)){
                console.log("se cambio algo en el managment")
                executeScriptMGMT()
            }else if((filters.MGTADDR==json.ipmgmt && filters.MGTGW==json.gwmgmt && filters.MGTMASK==json.maskmgmt) && !validateTunn(filters,json)){
                console.log("hubo un cambio en el tunnel")
                executeScriptTunnel()
            }else{
                console.log("no se debe ejecutar el script")
            }
            
            
            

        }
   
    })
    }).catch(e=>console.log(e))
    
    
}
function validateTunn(filters,json){
 console.log("VALIDANDO TUNNEL... ")
 console.log("filters tunsrc ",filters.TUNSRC,"json ipsrc ",json.ipsrc)
 console.log("filters TUNDST ",filters.TUNDST,"json ipdst ",json.ipdst)
 console.log("filters TUNADDR ",filters.TUNADDR,"json iptunn ",json.iptunn)
 console.log("filters TUNMASK ",filters.TUNMASK,"json mask ",json.masktunn)
 console.log("filters TUNGW ",filters.TUNGW,"json gwtunn ",json.gwtunn)
 return filters.TUNSRC==json.ipsrc && filters.TUNDST==json.ipdst && filters.TUNADDR==json.iptunn && filters.TUNMASK==json.masktunn && filters.TUNGW==json.gwtunn
}


function executeFIlterBash(){
    cp.exec('setrules',(error,stdout,stderr)=>{
        console.log("ejecucion de script trafico")
        console.log(stdout)
        console.log(stderr)
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    });
}


function executeScriptTunnel(){
    cp.exec('settunnel',(error,stdout,stderr)=>{
        console.log(stdout)
        console.log(stderr)
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    });
}

function executeScriptMGMT(){
    cp.exec('setmgmt',(error,stdout,stderr)=>{
        console.log(stdout)
        console.log(stderr)
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    });
}

function executeDelRules(){
    cp.exec('delrules',(error,stdout,stderr)=>{
        console.log("Eliminado todas las reglas...")
        console.log(stdout)
        console.log(stderr)
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    });
}

function getFilters(){
   var cont=0
    return new Promise((res,rej)=>{
        try{
            var reader = readline.createInterface({
                input: fs.createReadStream(path.join("../../conf/rules.cfg")),
            });
            reader.on('line',function(line){
                linea=line.split("=")
                console.log("linea con split ",linea)
                if(linea[0]=="ALL"){
                    cont+=1
                    jsonFilter.ALL=[]
                    if(linea[1]!="()"){
                        var text=linea[1].split("(").join("")
                        var element=text.split(")").join("")
                        jsonFilter.ALL.push(element.split(" "))
                        jsonFilter.vlan=[]
                        jsonFilter.ProtoPort=[]
                        jsonFilter.IPPORT=[]
                    }

                }
                if(linea[0]=="VLAN"){
                    cont+=1
                    jsonFilter.vlan=[]
                    if(linea[1]!="()"){
                        var text=linea[1].split("(").join("")
                        var element=text.split(")").join("")
                        jsonFilter.vlan.push(element.split(" "))
                        jsonFilter.ALL=[]
                        jsonFilter.ProtoPort=[]
                        jsonFilter.IPPORT=[]
                    }
                }
                if(linea[0]=="PROTOPORT"){
                   cont+=1
                   jsonFilter.ProtoPort=[]
                   if (linea[1]!="()"){
                    var text=linea[1].split("(").join("")
                    var element=text.split(")").join("")
                    jsonFilter.ProtoPort.push(element.split(" "))
                    jsonFilter.ALL=[]
                    jsonFilter.vlan=[]
                    jsonFilter.IPPORT=[]
                   }
                }
                if(linea[0]=="IPIPPORT"){
                    cont+=1
                    jsonFilter.IPPORT=[]
                    if(linea[1]!="()"){
                        var text=linea[1].split("(").join("")
                        var element=text.split(")").join("")
                        jsonFilter.IPPORT.push(element.split(" "))
                        console.log("jsonfilter ",jsonFilter)
                        jsonFilter.ALL=[]
                        jsonFilter.vlan=[]
                        jsonFilter.ProtoPort=[]
                    }
                }
            })
            
        } catch(err){
            rej(err)
        }
        reader.on('close',function(){
            if(cont==0){
                    jsonFilter.ALL=[]
                    jsonFilter.vlan=[]
                    jsonFilter.ProtoPort=[]
                    jsonFilter.IPPORT=[]
                }
            console.log("jsonfilter a enviar",jsonFilter)
            res(jsonFilter)
        })
    })
    

}



module.exports=
{writer:writer,writeTunnel:writeTunnel,getFilters:getFilters,executeDelRules:executeDelRules}


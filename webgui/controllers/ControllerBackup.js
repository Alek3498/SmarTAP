const { json } = require('body-parser')
let fs=require('fs')
let readline=require('readline')
var path=require('path')
const lineReader = require('line-reader');

var jsonBack={ "ALL":[],"vlan": [], "ProtoPort": [],"IPPORT":[]}
function generateBackup(){
    jsonBack.vlan=[]
    jsonBack.ProtoPort=[]
    jsonBack.IPPORT=[]
    jsonBack.ALL=[]
    return new Promise((res,rej)=>{
        try{
            var reader = readline.createInterface({
                input: fs.createReadStream(path.join("./backup/backup.cfg")),
            });
            reader.on('line',function(line){
                linea=line.split("=")
                if(linea[0]=="ALL"){
                    jsonBack.ALL.push(linea[1])
                }
                if(linea[0]=="VLAN"){
                    jsonBack.vlan.push(linea[1])
                }
                if(linea[0]=="PROTOPORT"){
                    jsonBack.ProtoPort.push(linea[1])
                }
                if(linea[0]=="IPIPPORT"){
                    jsonBack.IPPORT.push(linea[1])
                }
                res(jsonBack)
            })
            
        } catch(err){
            rej(err)
        }
    })

    
}
module.exports={
    generateBackup:generateBackup
}
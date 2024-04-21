let fs=require('fs')
let readline=require('readline')
var path=require('path')
const lineReader = require('line-reader');

var jsonMGMT={"tunif":"","ipsrc":"","ipdst":"","iptunn":"","masktunn":"","gwtunn":"","ipmgmt":"","gwmgmt":"","maskmgmt":""}

function getMGMT(){
    return new Promise((res,rej)=>{
        try{
            var reader = readline.createInterface({
                input: fs.createReadStream(path.join("../../conf/net.cfg")),
                
            });
            reader.on('line', function(line){
                linea=line.split("=")
                if(linea[0]=="TUNIF"){
                    jsonMGMT.tunif=linea[1]
                }
                if(linea[0]=="TUNSRC"){
                    jsonMGMT.ipsrc=linea[1]
                }
                if(linea[0]=="TUNDST"){
                    jsonMGMT.ipdst=linea[1]
                }
                if(linea[0]=="TUNADDR"){
                    jsonMGMT.iptunn=linea[1]
                }
                if(linea[0]=="TUNMASK"){
                    jsonMGMT.masktunn=linea[1]
                }
                if(linea[0]=="TUNGW"){
                    jsonMGMT.gwtunn=linea[1]
                }
                if(linea[0]=="MGTADDR"){
                    jsonMGMT.ipmgmt=linea[1]
                }
                if(linea[0]=="MGTMASK"){
                    jsonMGMT.maskmgmt=linea[1]
                }
                if(linea[0]=="MGTGW"){
                    jsonMGMT.gwmgmt=linea[1]
                }
                
            })
            
        } catch(err){
            rej(err)
        }
        reader.on('close',function(){
            res(jsonMGMT)
            
        })
    })
    

}

module.exports={
    getMGMT:getMGMT
}

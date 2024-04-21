let fs=require('fs')
let readline=require('readline')
var path=require('path')
const lineReader = require('line-reader');
const { json } = require('body-parser');
var bodyLog={"content":[],"first":true,"last":true,"number":0,"totalPages":0}

function checkPages(arrayObject,array){
    var cont=0
    while(cont<array["content"].length){
        cont+=1
    }
    if(cont>20){
        arrayObject.last=false
        arrayObject.totalPages=Math.trunc(cont/20)
    }
}

function getObjectLog(index,array){
  console.log("INDEX ",index)
  var arrayObject={"content":[],"first":true,"last":true,"number":0,"totalPages":0}
  var contLine=1
  checkPages(arrayObject,array)
  //console.log("array luego del check ",arrayObject)
  if(index>=20){
     arrayObject.first=false
  }
  arrayObject.number=Math.trunc(index/20)
  while(index<array["content"].length && contLine<=20){
      arrayObject["content"].push(array["content"][index])
      index+=1
      contLine+=1
  }
  if(index==array["content"].length){
    arrayObject.last=true
  }
  console.log("arrayobject ",arrayObject)
  return arrayObject
}

function getActions(page){
    var cont=0
    var index=1*20
    if(!page){
        console.log("page no es un valor")
        var index=0
    }else{
      var index=page*20
    }
    return new Promise((res,rej)=>{
        bodyLog["content"]=[]
       try{
           var reader = readline.createInterface({
               input: fs.createReadStream(path.join("../../logs/user.logs")),
           });
           reader.on('line',function(line){
               var jsonLine=JSON.parse(line)
               var jsonlogs={
                   "timestamp":jsonLine["TimeStamp"],
                   "ip":jsonLine["ip"],
                   "user":jsonLine["user"],
                   "action":jsonLine["action"]
               }
               bodyLog["content"].push(jsonlogs)
        })
        reader.on('close',function(){
            var arrayObject=getObjectLog(index,bodyLog)
            res(arrayObject)
           })
       }catch(err){
           rej(err)
       }
    })
    
   }
   
   
   module.exports={
       getActions:getActions
   }
   

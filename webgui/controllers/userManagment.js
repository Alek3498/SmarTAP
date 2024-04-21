let actionValidate=require('../controllers/actionValidate')
let fs=require('fs')
let readline=require('readline')
var path=require('path')

function authenticated(user,password){
  let data=fs.readFileSync(path.join("./Users/user.json"))
  let users=JSON.parse(data)
  console.log("users en authentcate ",users)
    console.log("USERNAME ",user)
    console.log("PASSWORD ",password)
    var authenticated=false
    for(var i=0;i<users["content"].length;i++){
      if(users["content"][i]["username"]==user && users["content"][i]["password"]==password){
        authenticated=true
      }
    }
    return authenticated
    
  }

function login(req,res){
  let f=new Date()
  let timeStamp=f.getFullYear()+ "-" + (f.getMonth() +1) + "-" +f.getDate() + " " + f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds()
  let user=req.body.user
  let password=req.body.password
  if(authenticated(user,password)){
    console.log("autenticado ok!!")
     req.session.user=user
     req.session.password=password
     req.session.ip=(req.header('x-forwarded-for') || req.connection.remoteAddress).substring(7)
     actionValidate.writerLog(timeStamp,req.session.user,"postLOGIN",req.session.ip)
     res.redirect('mgmt')
  }else{
    console.log("autenticado NO ok!!")
    res.redirect('/loginError')
  }
}

module.exports={login:login}

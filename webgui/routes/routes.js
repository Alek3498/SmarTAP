var express=require('express')
var app=express()
var router=express.Router();
var path=require('path')
var controller=require('../controllers/ControllerFIlter')
let fs=require('fs')
const readline=require('readline')
var session = require('express-session');
//var jsonUser=require('../Users/user.json')
var controllerBackup=require('../controllers/ControllerBackup')
var controllerUser=require('../controllers/user')
var controllerValidate=require('../controllers/actionValidate')
var controllerLogs=require('../controllers/getActions')
var controllerMgmt=require('../controllers/ControllerMGMT');
const ControllerFIlter = require('../controllers/ControllerFIlter');
const API_LOGS='http://localhost:3000'
var http=require('../service/httpservice');
const actionValidate = require('../controllers/actionValidate');
const login=require('../controllers/userManagment')
require('dotenv').config()
/******************Middelware********************/
router.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: true,
  saveUninitialized: true
}));
router.use(express.static(path.join(__dirname, 'public')))
console.log("entorno",process.env.API_FRONTEND)

/******************Path security********************/
function authenticated(user,password){
  let data=fs.readFileSync(path.join("./Users/user.json"))
  let jsonUser=JSON.parse(data)
  var authenticated=false
  for(var i=0;i<jsonUser["content"].length;i++){
    if(jsonUser["content"][i]["username"]==user && jsonUser["content"][i]["password"]==password){
      authenticated=true
    }
  }
  return authenticated
}
var auth=function(req,res,next){
  let index = req.path.substring(1,req.path.lenght)+req.method;
  console.log("index antes de enviar ",index)
 if(!authenticated(req.session.user,req.session.password)){
    console.log("no esta logeado")
    return res.redirect('/')
  }else{
  req.session.ip=(req.header('x-forwarded-for') || req.connection.remoteAddress).substring(7)
  let f=new Date()
  req.session.timeStamp=f.getFullYear()+ "-" + (f.getMonth() +1) + "-" +f.getDate() + " " + f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds()
  controllerValidate.writerLog(req.session.timeStamp,req.session.user,index,req.session.ip)
  next();
  }
}
/******************router Functions********************/
router.get('/loginError',function(req,res){
  res.render('loginError')
})
router.get('/',function(req,res){
req.session.user=""
req.session.password=""
res.render('login')
})
router.post('/',login.login)

router.get('/filters',auth,(req,res)=>{console.log("action path",req.path)
let index = req.path.substring(1,req.path.lenght)+req.method;
console.log("index en el get route",index)
res.render('filters',{layout:'layout',title:"filtros"})})

router.get('/tunnel',auth,(req,res)=>{res.render('tunnel',{layout:'layout'})})
router.get('/mgmt',auth,(req,res)=>{res.render('mgmt',{layout:'layout',ip:process.env.API_FRONTEND})})
router.get('/status',auth,(req,res)=>{res.render('status',{layout:'layout'})})
router.get('/newUser',auth,(req,res)=>{res.render('newUser',{layout:'layout'})})

router.get('/listUser',auth,(req,res)=>{
  let data=fs.readFileSync(path.join("./Users/user.json"))
  let jsonUser=JSON.parse(data)
  let user=jsonUser
  console.log("Json-user es",user)
  res.render('listUser',{layout:'layout',title:"Users",users:user})})


router.post('/deleteUser',auth,(req,res)=>{
  let response=req.body
  controllerUser.deleteUser(response)
  res.send("ok")
})
router.post('/filters',auth,(req,res)=>{
 let response=req.body
 let txt="ALL=("+response["ALL"]+")"+"\nVLAN=("+response["vlan"]+")"+"\nPROTOPORT=("+response["ProtoPort"]+")"+"\nIPIPPORT=("+response["IPPORT"]+")\n"
 controller.writer(txt)
 res.send("ok")})

router.get('/deleteALL',auth,(req,res)=>{
   ControllerFIlter.executeDelRules()
   res.send("response 200")
 })

router.post('/tunnel',auth,(req,res)=>{
  let response=req.body
  console.log("response recibida ",response)
  let text="TUNIF="+response["TUNIF"]+"\nTUNDST="+response["TUNDST"]+"\nTUNSRC="+response["TUNSRC"]+"\nTUNADDR="+response["TUNADDR"]+"\nTUNMASK="+response["TUNMASK"]+"\nTUNGW="+response["TUNGW"]+"\n"+"\n"+"\nMGTIF="+response["MGTIF"]+"\nMGTADDR="+response["MGTADDR"]+"\nMGTMASK="+response["MGTMASK"]+"\nMGTGW="+response["MGTGW"]
  controller.writeTunnel(text,response)
  res.send("response ok")
})

router.get('/rules',(req,res)=>{
  var response=""
  var json=controllerBackup.generateBackup()
  json.then((val)=>{response=val,console.log(response),res.send(response)})
  
})
router.get('/tunnelconf',(req,res)=>{
  var response=""
  var json=controllerMgmt.getMGMT()
  json.then((val)=>{response=val,console.log(response),res.send(response)})
})

router.get('/download',(req,res)=>{
  var file=path.join("./backup/backup.cfg")
  var filename=path.basename(file)
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  var filestream=fs.createReadStream(file)
  filestream.pipe(res)
})

router.get('/downloadTunnel',(req,res)=>{
  var file=path.join("./backup/backupTunnel.cfg")
  var filename=path.basename(file)
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  var filestream=fs.createReadStream(file)
  filestream.pipe(res)
})

router.get('/help',(req,res)=>{
  var file=path.join("./Manual.docx")
  var filename=path.basename(file)
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  var filestream=fs.createReadStream(file)
  filestream.pipe(res)
})

router.post('/newUser',auth,(req,res)=>{
  let response=req.body
  controllerUser.addUser(response)
  res.send("usuario creado!")
})

router.get('/logUser',auth,(req,res)=>{
  var response=""
  let log=controllerLogs.getActions(req.query.page)
  log.then((val)=>{response=val,console.log("response es","response"),res.render('logUser',{layout:'layout',title:'log users',logs:response})})
 })
 



router.get('/getFilters',auth,(req,res)=>{
  var response=""
  let json=ControllerFIlter.getFilters()
  json.then((val)=>{response=val,console.log("response del getfilter",response),res.send(response)})
 })

router.get("/checkUsers",(req,res)=>{
  let data=fs.readFileSync(path.join("./Users/user.json"))
  let jsonUser=JSON.parse(data)
  res.send(jsonUser)
})

router.get("/downloadLogs",(req,res)=>{
  var file=path.join("../../logs/user.logs")
  var filename=path.basename(file)
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  var filestream=fs.createReadStream(file)
  filestream.pipe(res)
})

module.exports=router

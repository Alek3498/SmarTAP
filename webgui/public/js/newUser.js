const NEW_USER="https://"+localStorage.getItem('ipmgmt')+":443/newUser"
const CHECK_USER="https://"+localStorage.getItem('ipmgmt')+":443/checkUsers"
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const getJsonAPI=(url)=>{
  var datos, xhttp = new XMLHttpRequest();
  xhttp.open("GET", url, false);
  xhttp.onload = function() {
      datos = JSON.parse(xhttp.responseText);
  }
  xhttp.send();
  return datos;
};


function getUser(){
    var response=""
    //obtener información
    const username_val=$("input#inputUsername").val();
    const name_val=$("input#inputName").val();
    const surname_val=$("input#inputSurname").val();
    const password_val=$("input#inputPassword").val()
    var json={}
    // Se arma el objeto data a enviar como body en el POST a la api
    var data={
      username:username_val,
      name:name_val,
      surname:surname_val,
      password:password_val
    }
    //getJson().then((data)=>console.log(data))
    json=getJsonAPI(CHECK_USER)
    
    if(data.username && data.name && data.surname && data.password && !response && !checkExist(data.username,json)){
    axios.post(NEW_USER,data)
    .then((response)=>{
        Swal.close();
        Swal.fire(
            'Operación exitosa',
            'Usuario creado',
            'success'
        )
    })
    
  
    .catch(e => {
        Swal.close();
        error_popup();
      })
      
    }else if(checkExist(data.username,json)){
      Swal.fire({
        type: 'error',
        title: 'Ingreso invalido',
        text:  'Usuario con el mismo ID ya existe'
      })
    }
    
    else{
      Swal.fire({
        type: 'error',
        title: 'Ingreso invalido',
        text:  'Todos los campos del formulario deben estar completos'
      })
    }
}


$("#primary-addUser").click(function( e ){
    e.preventDefault();
    getUser();
    //alert("Se ha agregado un usuario");
  })


$('#showPassword').click(function(){
    if( $(this).is(':checked') ){
      $('#inputPassword').prop('type','text');
    } else {
      $('#inputPassword').prop('type','password');
    }
  });

function checkExist(user,json){
 var exist=false
 var i=0
 while(i<json["content"].length && !exist){
   if(json["content"][i].username==user){
     exist=true
   }
   i+=1
 }
 return exist
}

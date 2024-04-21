var UserObject=require('../routes/authentication.json')
var userCreated=require('../Users/user.json')
var text=""
let fs=require('fs')
function addUser(response){
    console.log("response name ",response["name"],
    "response apellido",response["surname"],
    "response username",response["username"],
    "password",response["password"]
    )

    var json={
        "name":response["name"],
        "surname":response["surname"],
        "username":response["username"],
        "password":response["password"],
    }
    userCreated["content"].push(json)
    console.log("userObject antes de entrar al loop",userCreated["content"])
    text=text+JSON.stringify(userCreated)
    fs.writeFile('./Users/user.json',JSON.stringify(userCreated),function(err){
        if(err){
         console.error(err)
        }
    })
}

function deleteUser(user){
    console.log("user pasado ",user)
    userCreated["content"]=userCreated["content"].filter(function(element){
        console.log("usersname ",element.username)
        return element.username!=user["username"]
    })
    console.log("array filtrado ",userCreated["content"])
    fs.writeFile('./Users/user.json',JSON.stringify(userCreated),function(err){
        if(err){
         console.error(err)
        }
    })

}




module.exports={
    UserObject:userCreated,
    addUser:addUser,
    deleteUser:deleteUser
}
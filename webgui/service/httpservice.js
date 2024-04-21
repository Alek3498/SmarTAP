const { get } = require("http");

function getJson(url){
    var datos, xhttp = new XMLHttpRequest();
    //trae la url, ¡sin asincronismo
    xhttp.open("GET", url, false);
    xhttp.onload = function() {
        datos = JSON.parse(xhttp.responseText);
    }
    console.log("url es",url)
    xhttp.send();
    return datos;
};

module.exports={
    getjson:getJson
}
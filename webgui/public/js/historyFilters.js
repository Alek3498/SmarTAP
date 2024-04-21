var boxCards=document.getElementById("cardhistory")
var buttonHide=document.getElementById("buttonHide")
var cardbody=document.getElementById("cardbody")
const TEXT_URL="https://"+localStorage.getItem('ipmgmt')+":443/rules"
const TEXT_DOWNLOAD="https://"+localStorage.getItem('ipmgmt')+":443/download"

function notLabelExist(label){
 var exist=false
 childrenNodes=cardbody.childNodes;
 //console.log("childrenNodes",childrenNodes[1])
 for(var i=0;i<childrenNodes.length;i++){
     if(childrenNodes[i].nextElementSibling=="<label>"+label+"</label>"){
        exist=true
     }

 }
 return exist
}
function showFiltersHistory(){
    var label=document.createElement("label")
    axios.get(TEXT_URL)
    .then((response)=>{
        console.log("Response recibida",response.data)
        boxCards.style.display="inline"
        buttonHide.style.display="inline"
        for(i in response.data){
            for(var x=0;x<=response.data[i].length;x++){
                if(response.data[i]!="()"){
                    if(!notLabelExist(i+":"+response.data[i])){
                    label.textContent=i+":"+response.data[i]
                    cardbody.appendChild(label)
                    
                    }
                }
            }
        }
        
    })
    .catch((error=>{
        console.log(error)
    }))
}

function DownloadHistory(){
 axios.get(TEXT_DOWNLOAD)
 .catch((error=>{
     console.log(error)
 }))
}

function hideHistory(){
    boxCards.style.display="none"
}

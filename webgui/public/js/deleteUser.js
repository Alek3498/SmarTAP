//const API_DELETE="https://192.168.1.170:443/deleteUser"
const API_DELETE="https://"+localStorage.getItem('ipmgmt')+":443/deleteUser"
//console.log("API EN DELETEUSER ",API_DELETE)
$('.eliminar-usuario').click(function(){
  var api=$("#ip-mgmt-id")
   //console.log(api)
    let tr = $(this).parents("tr");
    const username = tr.find("td:eq(2)").text();
    Swal.fire({
      title: '¿Está seguro?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SI'
    }).then((result) => {
      if (result.value) {
        var body = {username:username}
        axios.post(API_DELETE,body,"Eliminando el usuario")
        .then( response => {
            tr.remove();
            Swal.close();
            Swal.fire(
                'Operación exitosa',
                'El usuario fue eliminado',
                'success'
            )
        })
        .catch( e => {
          Swal.close();
          error_popup();
        })
        
      }
    })
})

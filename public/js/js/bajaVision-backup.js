
/*=============================================
BOTON VER CONSULTA
=============================================*/

$(".btnVerConsulta").on("click", function(){


    var id_consulta = $(this).attr("id_consulta");

    window.location = "index.php?ruta=ver-baja-vision&id_consulta="+id_consulta;


});


/*=============================================
BOTON EDITAR CONSULTA
=============================================*/

$(".btnEditarConsulta").on("click", function(){


  var id_consulta = $(this).attr("id_consulta");
  
  var id_paciente = $(this).attr("id_paciente");

  var id_terapia = $(this).attr("id_terapia");

  window.location = "index.php?ruta=editar-baja-vision&id_consulta="+id_consulta+'&id_paciente='+id_paciente+'&id_terapia='+id_terapia;


});




/*=============================================
BOTON AGREGAR TERAPIA
=============================================*/

$(".btnAgregarTerapia").on("click", function(){


  var agregar_terapia = $(this).attr("agregar_terapia");

  var id_paciente = $(this).attr("id_paciente");

  var id_terapia = $(this).attr("id_terapia");

  window.location = "index.php?ruta=terapia_bv&agregar_terapia="+agregar_terapia+'&id_paciente='+id_paciente+'&id_terapia='+id_terapia;


});

/*=============================================
BOTON VER TERAPIA
=============================================*/

$(".btnVerTerapia").on("click", function(){


  var ver_terapia = $(this).attr("ver_terapia");

  var id_paciente = $(this).attr("id_paciente");

  var id_terapia = $(this).attr("id_terapia");

  window.location = "index.php?ruta=terapia_bv&ver_terapia="+ver_terapia+'&id_paciente='+id_paciente+'&id_terapia='+id_terapia;;


});

/*=============================================
BOTON EDITAR TERAPIA
=============================================*/

$(".btnEditarTerapia").on("click", function(){

  // var editar_terapia = $(this).attr("editar_terapia");
  // var id_paciente = $(this).attr("id_paciente");
  // var id_terapia = $(this).attr("id_terapia");
  // window.location = "index.php?ruta=terapia_bv&editar_terapia="+editar_terapia+'&id_paciente='+id_paciente+'&id_terapia='+id_terapia;
});


/*=============================================
ELIMINAR TERAPIA
=============================================*/
$(".btnEliminarTerapia").on("click", function(){

  var eliminar_terapia = $(this).attr("eliminar_terapia");

  var id_paciente = $(this).attr("id_paciente");

  var id_terapia = $(this).attr("id_terapia");


  swal({
    title: '¿Está seguro de borrar la terapia?',
    text: "¡Si no lo está puede cancelar la accíón!",
    type: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Si, borrar terapia!'
  }).then(function(result){

    if(result.value){

      window.location = "index.php?ruta=terapiasBajaVision&id_terapia="+id_terapia+'&id_paciente='+id_paciente+'&eliminar_terapia='+eliminar_terapia;

    }

  })

})





/*=============================================
ELIMINAR CONSULTA
=============================================*/
$(".btnEliminarConsulta").on("click", function(){

   var borrar_consulta = $(this).attr("borrar_consulta");

   var id_paciente = $(this).attr("id_paciente");

 
   swal({
     title: '¿Está seguro de borrar la consulta?',
     text: "¡Si no lo está puede cancelar la accíón!",
     type: 'warning',
     showCancelButton: true,
     cancelButtonText: 'Cancelar',
     confirmButtonText: 'Si, borrar consulta!'
   }).then(function(result){
 
     if(result.value){
 
       window.location = "index.php?ruta=historia-paciente&id_paciente="+id_paciente+'&borrar_consultaBV='+borrar_consulta;
 
     }
 
   })
 
 })



 /*=============================================
ACTIVAR PAGO BAJA VISION 
=============================================*/
$(".sesiones").on("click", ".btnActivar", function(){

	var idSesion = $(this).attr("idSesion");
    var idPaciente = $(this).attr("idPaciente");
	var estadoPago = $(this).attr("estadoPago");
    var idTerapia = $(this).attr("idTerapia");


	var datos = new FormData();
 	datos.append("activarId", idSesion);
  	datos.append("activarPago", estadoPago);

  	$.ajax({

	  url:"ajax/terapiasbv.ajax.php",
	  method: "POST",
	  data: datos,
	  cache: false,
      contentType: false,
      processData: false,
      success: function(respuesta){

      		if(window.matchMedia("(max-width:767px)").matches){

	      		 swal({
			      title: "El pago ha sido actualizado",
			      type: "success",
			      confirmButtonText: "¡Cerrar!"
			    }).then(function(result) {
			        if (result.value) {

			        	          
                         window.location = "index.php?ruta=terapiasBajaVision&id_terapia="+idTerapia+"&id_paciente="+idPaciente;

                      
			        }


				});

	      	}

      }

  	})

  	if(estadoPago == 0){

  		$(this).removeClass('btn-success');
  		$(this).addClass('btn-danger');
  		$(this).html('Sin Pago');
  		$(this).attr('estadoPago',1);

  	}else{

  		$(this).addClass('btn-success');
  		$(this).removeClass('btn-danger');
  		$(this).html('Pagado');
  		$(this).attr('estadoPago',0);

  	}

})
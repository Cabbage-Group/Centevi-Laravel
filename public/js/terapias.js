// /*=============================================
// ACTIVAR PAGO BAJA VISION 
// =============================================*/
// $(".sesiones").on("click", ".btnActivar", function(){

// 	var idSesion = $(this).attr("idSesion");
//     var idPaciente = $(this).attr("idPaciente");
// 	var estadoPago = $(this).attr("estadoPago");
//     var idTerapia = $(this).attr("idTerapia");


// 	var datos = new FormData();
//  	datos.append("activarId", idSesion);
//   	datos.append("activarPago", estadoPago);

//   	$.ajax({

// 	  url:"ajax/terapiasbv.ajax.php",
// 	  method: "POST",
// 	  data: datos,
// 	  cache: false,
//       contentType: false,
//       processData: false,
//       success: function(respuesta){

//       		if(window.matchMedia("(max-width:767px)").matches){

// 	      		 swal({
// 			      title: "El pago ha sido actualizado",
// 			      type: "success",
// 			      confirmButtonText: "¡Cerrar!"
// 			    }).then(function(result) {
// 			        if (result.value) {

			        	          
//                          window.location = "index.php?ruta=terapiasBajaVision&id_terapia="+idTerapia+"&id_paciente="+idPaciente;

                      
// 			        }


// 				});

// 	      	}

//       }

//   	})

//   	if(estadoPago == 0){

//   		$(this).removeClass('btn-success');
//   		$(this).addClass('btn-danger');
//   		$(this).html('Desactivado');
//   		$(this).attr('estadoPago',1);

//   	}else{

//   		$(this).addClass('btn-success');
//   		$(this).removeClass('btn-danger');
//   		$(this).html('Activado');
//   		$(this).attr('estadoPago',0);

//   	}

// })


/*=============================================
BOTON IR A HISTORIA
=============================================*/

$(".tabla_pacientes").on("click", ".btnVerHistoria", function(){


	var id_paciente = $(this).attr("id_paciente");

	window.location = "index.php?ruta=historia-paciente&id_paciente="+id_paciente;


});


/*=============================================
BOTON EDITAR PACIENTE
=============================================*/

$(".tabla_pacientes").on("click", ".btnEditarPaciente", function(){


	 var id_paciente = $(this).attr("id_paciente");

	 window.location = "index.php?ruta=editar-paciente&id_paciente="+id_paciente;


});


/*=============================================
ELIMINAR PACIENTE
=============================================*/
$(".tabla_pacientes").on("click", ".btnEliminarPaciente", function(){

	var borrar_paciente = $(this).attr("borrar_paciente");

  
	swal({
	  title: '¿Está seguro de borrar el paciente?',
	  text: "¡Si no lo está puede cancelar la accíón!",
	  type: 'warning',
	  showCancelButton: true,
	  cancelButtonText: 'Cancelar',
	  confirmButtonText: 'Si, borrar paciente!'
	}).then(function(result){
  
	  if(result.value){
  
		window.location = "index.php?ruta=lista-pacientes&borrar_paciente="+borrar_paciente;
  
	  }
  
	})
  
  })



  /*=============================================
ELIMINAR PACIENTE
=============================================*/
$(".eliminarDocumentoPaciente").on("click", function(){

	var borrar_documento = $(this).attr("borrar_documento");
	var id_paciente = $(this).attr("id_paciente");

	var nombre = $(this).attr("nombre");

  
	swal({
	  title: '¿Está seguro de borrar el documento?',
	  text: "¡Si no lo está puede cancelar la accíón!",
	  type: 'warning',
	  showCancelButton: true,
	  cancelButtonText: 'Cancelar',
	  confirmButtonText: 'Si, borrar documento!'
	}).then(function(result){
  
	  if(result.value){
  
		window.location = "index.php?ruta=historia-paciente&id_paciente="+id_paciente+"&borrar_documento="+borrar_documento+"&nombre="+nombre;
  
	  }
  
	})
  
  })



/*=============================================
BOTON EDITAR PACIENTE MENORES
=============================================*/

$(".tabla_pacientesMenores").on("click", ".btnEditarPaciente", function(){


    var id_paciente = $(this).attr("id_paciente");

    window.location = "index.php?ruta=editar-paciente-menor&id_paciente="+id_paciente;


});


/*=============================================
ELIMINAR PACIENTE MENOR
=============================================*/
$(".tabla_pacientesMenores").on("click", ".btnEliminarPacienteM", function(){

	var borrar_paciente = $(this).attr("borrar_paciente");

  
	swal({
	  title: '¿Está seguro de borrar el paciente?',
	  text: "¡Si no lo está puede cancelar la accíón!",
	  type: 'warning',
	  showCancelButton: true,
	  cancelButtonText: 'Cancelar',
	  confirmButtonText: 'Si, borrar paciente!'
	}).then(function(result){
  
	  if(result.value){
  
		window.location = "index.php?ruta=lista-pacientes-menores&borrar_paciente="+borrar_paciente;
  
	  }
  
	})
  
  })


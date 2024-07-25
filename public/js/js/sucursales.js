

/*=============================================
EDITAR SUCURSAL
=============================================*/
$(".tablaSucursal").on("click", ".btnEditarSucursal", function(){



	var id_sucursal = $(this).attr("id_sucursal");


	
	var datos = new FormData();
	datos.append("idSucursal", id_sucursal);

	$.ajax({

		url:"ajax/sucursales.ajax.php",
		method: "POST",
		data: datos,
		cache: false,
		contentType: false,
		processData: false,
		dataType: "json",
		success: function(respuesta){
			
         
			$("#id_sucursal").val(respuesta["id_sucursal"]);
			$("#editarNombre").val(respuesta["nombre"]);
			$("#editarUbicacion").val(respuesta["ubicacion"]);
		
			
		
	

		}

	});

})



/*=============================================
REVISAR SI EL USUARIO YA ESTÁ REGISTRADO
=============================================*/

// $("#nuevoUsuario").change(function(){

// 	$(".alert").remove();

// 	var usuario = $(this).val();

// 	var datos = new FormData();
// 	datos.append("validarUsuario", usuario);

// 	 $.ajax({
// 	    url:"ajax/usuarios.ajax.php",
// 	    method:"POST",
// 	    data: datos,
// 	    cache: false,
// 	    contentType: false,
// 	    processData: false,
// 	    dataType: "json",
// 	    success:function(respuesta){
	    	
// 	    	if(respuesta){

// 	    		$("#nuevoUsuario").parent().after('<div class="alert alert-warning">Este usuario ya existe en la base de datos</div>');

// 	    		$("#nuevoUsuario").val("");

// 	    	}

// 	    }

// 	})
// })

/*=============================================
ELIMINAR SUCURSAL
=============================================*/
$(".tablaSucursal").on("click", ".btnEliminarSucursal", function(){

  var borrar_sucursal = $(this).attr("borrar_sucursal");


  swal({
    title: '¿Está seguro de borrar la sucursal?',
    text: "¡Si no lo está puede cancelar la accíón!",
    type: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Si, borrar sucursal!'
  }).then(function(result){

    if(result.value){

      window.location = 'index.php?ruta=sucursales&borrar_sucursal='+borrar_sucursal

    }

  })

})





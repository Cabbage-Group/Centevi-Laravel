/*=============================================
CONSULTA GENERICA
=============================================*/

/*=============================================
BOTON VER CONSULTA GENERICA
=============================================*/

$(".btnVerConsultaCG").on("click", function(){


    var id_consulta = $(this).attr("id_consulta");
     window.open("index.php?ruta=ver-consulta-generica&id_consulta=" + id_consulta, '_blank');


});


/*=============================================
BOTON EDITAR CONSULTA GENERICA
=============================================*/

$(".btnEditarConsultaCG").on("click", function(){


  var id_consulta = $(this).attr("id_consulta");

  window.open("index.php?ruta=editar-consulta-generica&id_consulta=" + id_consulta, '_blank');


});




/*=============================================
ELIMINAR CONSULTA GENERICA
=============================================*/
$(".btnEliminarConsultaCG").on("click", function(){

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
  
        window.location = "index.php?ruta=historia-paciente&id_paciente="+id_paciente+'&borrar_consultaCG='+borrar_consulta;
  
      }
  
    })
  
  })
/*=============================================
BAJA VISION
=============================================*/

/*=============================================
BOTON VER CONSULTA
=============================================*/

$(".btnVerConsultaBV").on("click", function(){


    var id_consulta = $(this).attr("id_consulta");
     window.open("index.php?ruta=ver-baja-vision&id_consulta=" + id_consulta, '_blank');


});


/*=============================================
BOTON EDITAR CONSULTA
=============================================*/

$(".btnEditarConsultaBV").on("click", function(){


  var id_consulta = $(this).attr("id_consulta");
 window.open("index.php?ruta=editar-baja-vision&id_consulta=" + id_consulta, '_blank');

});




/*=============================================
ELIMINAR CONSULTA
=============================================*/
$(".btnEliminarConsultaBV").on("click", function(){

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
ELIMINAR CARD TERAPIA
=============================================*/
$(".btn_eliminar_terapiagbv").on("click", function(){

  var id_terapia = $(this).attr("id_terapia");

  var id_paciente = $(this).attr("id_paciente");


  swal({
    title: '¿Está seguro de borrar la terapia?',
    text: "¡ Esta acción es irreversible, si no lo está puede cancelar la accíón!",
    type: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Si, borrar consulta!'
  }).then(function(result){

    if(result.value){

      window.location = 'index.php?ruta=historia-paciente&id_paciente='+id_paciente+'&borrar_terapiagbv='+id_terapia;

    }

  })

})




/*=============================================
OPTOMETRIA NEONATOS
=============================================*/


/*=============================================
BOTON VER CONSULTA
=============================================*/



$(".btnVerConsultaNeonatos").on("click", function(){
    var id_consulta = $(this).attr("id_consulta");
    window.open("index.php?ruta=ver-optometria-neonatos&id_consulta=" + id_consulta, '_blank');
});




/*=============================================
BOTON EDITAR CONSULTA
=============================================*/

$(".btnEditarConsultaNeonatos").on("click", function(){
  var id_consulta = $(this).attr("id_consulta");
  window.open("index.php?ruta=editar-optometria-neonatos&id_consulta=" + id_consulta, '_blank');

});



/*=============================================
ELIMINAR CONSULTA
=============================================*/
$(".btnEliminarConsultaNeonatos").on("click", function(){

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
 
       window.location = "index.php?ruta=historia-paciente&id_paciente="+id_paciente+'&borrar_consultaNeonatos='+borrar_consulta;
 
     }
 
   })
 
 })

  /*=============================================
ELIMINAR CARD TERAPIA
=============================================*/
$(".btn_eliminar_terapiagopn").on("click", function(){

  var id_terapia = $(this).attr("id_terapia");

  var id_paciente = $(this).attr("id_paciente");


  swal({
    title: '¿Está seguro de borrar la terapia?',
    text: "¡ Esta acción es irreversible, si no lo está puede cancelar la accíón!",
    type: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Si, borrar consulta!'
  }).then(function(result){

    if(result.value){

      window.location = 'index.php?ruta=historia-paciente&id_paciente='+id_paciente+'&borrar_terapiaopn='+id_terapia;

    }

  })

})



/*=============================================
OPTOMETRIA PEDIATRICA
=============================================*/


 /*=============================================
BOTON VER CONSULTA
=============================================*/

$(".btnVerConsultaPediatrica").on("click", function(){
 var id_consulta = $(this).attr("id_consulta");
  window.open("index.php?ruta=ver-optometria-pediatrica&id_consulta=" + id_consulta, '_blank');
});



/*=============================================
BOTON EDITAR CONSULTA
=============================================*/

$(".btnEditarConsultaPediatrica").on("click", function(){
 var id_consulta = $(this).attr("id_consulta");
 window.open("index.php?ruta=editar-optometria-pediatrica&id_consulta=" + id_consulta, '_blank');

});


/*=============================================
ELIMINAR CONSULTA
=============================================*/
$(".btnEliminarConsultaPediatrica").on("click", function(){

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

      window.location = "index.php?ruta=historia-paciente&id_paciente="+id_paciente+'&borrar_consultaPediatrica='+borrar_consulta;

    }

  })

})



  /*=============================================
ELIMINAR CARD TERAPIA
=============================================*/
$(".btn_eliminar_terapiagopp").on("click", function(){

  var id_terapia = $(this).attr("id_terapia");

  var id_paciente = $(this).attr("id_paciente");


  swal({
    title: '¿Está seguro de borrar la terapia?',
    text: "¡ Esta acción es irreversible, si no lo está puede cancelar la accíón!",
    type: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Si, borrar consulta!'
  }).then(function(result){

    if(result.value){

      window.location = 'index.php?ruta=historia-paciente&id_paciente='+id_paciente+'&borrar_terapiaopp='+id_terapia;

    }

  })

})





/*=============================================
ORTOPTICA ADULTOS
=============================================*/

/*=============================================
BOTON VER CONSULTA
=============================================*/

$(".btnVerConsultaOA").on("click", function(){
    var id_consulta = $(this).attr("id_consulta");
    window.open("index.php?ruta=ver-ortoptica-adultos&id_consulta=" + id_consulta, '_blank');
});


/*=============================================
BOTON EDITAR CONSULTA
=============================================*/

$(".btnEditarConsultaOA").on("click", function(){
  var id_consulta = $(this).attr("id_consulta");
  window.open("index.php?ruta=editar-ortoptica-adultos&id_consulta=" + id_consulta, '_blank');
});



/*=============================================
ELIMINAR CONSULTA
=============================================*/
$(".btnEliminarConsultaOA").on("click", function(){

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
  
        window.location = "index.php?ruta=historia-paciente&id_paciente="+id_paciente+'&borrar_consultaOrtoptica='+borrar_consulta;
  
      }
  
    })
  
  })

 /*=============================================
ELIMINAR CARD TERAPIA
=============================================*/
$(".btn_eliminar_terapiagoa").on("click", function(){

  var id_terapia = $(this).attr("id_terapia");

  var id_paciente = $(this).attr("id_paciente");


  swal({
    title: '¿Está seguro de borrar la terapia?',
    text: "¡ Esta acción es irreversible, si no lo está puede cancelar la accíón!",
    type: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Si, borrar consulta!'
  }).then(function(result){

    if(result.value){

      window.location = 'index.php?ruta=historia-paciente&id_paciente='+id_paciente+'&borrar_terapiagoa='+id_terapia;

    }

  })

})


/*=============================================
REFRACCION GENERAL
=============================================*/

/*=============================================
BOTON VER CONSULTA
=============================================*/

$(".btnVerConsultaRG").on("click", function(){


  var id_consulta = $(this).attr("id_consulta");
  
     window.open("index.php?ruta=ver-refraccion-general&id_consulta=" + id_consulta, '_blank');


});



/*=============================================
BOTON EDITAR CONSULTA
=============================================*/

$(".btnEditarConsultaRG").on("click", function(){


  var id_consulta = $(this).attr("id_consulta");

   window.open("index.php?ruta=editar-refraccion-general&id_consulta=" + id_consulta, '_blank');

  


});


/*=============================================
ELIMINAR CONSULTA
=============================================*/
$(".btnEliminarConsultaRG").on("click", function(){

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

      window.location = "index.php?ruta=historia-paciente&id_paciente="+id_paciente+'&borrar_consultaRefraccion='+borrar_consulta;

    }

  })

})

/*=============================================
BOTON VER RECETA
=============================================*/

$(".btnVerReceta").on("click", function(){


    var id_receta = $(this).attr("id_receta");

    window.location = "index.php?ruta=ver-receta&id_receta="+id_receta;


});


/*=============================================
BOTON EDITAR RECETA
=============================================*/

$(".btnEditarReceta").on("click", function(){


  var id_receta = $(this).attr("id_receta");

  window.location = "index.php?ruta=editar-receta&id_receta="+id_receta;


});



/*=============================================
ELIMINAR RECETA
=============================================*/
$(".btnEliminarReceta").on("click", function(){

   var borrar_receta = $(this).attr("borrar_receta");

 
   swal({
     title: '¿Está seguro de borrar la receta?',
     text: "¡Si no lo está puede cancelar la accíón!",
     type: 'warning',
     showCancelButton: true,
     cancelButtonText: 'Cancelar',
     confirmButtonText: 'Si, borrar receta!'
   }).then(function(result){
 
     if(result.value){
 
       window.location = "index.php?ruta=recetas&borrar_receta="+borrar_receta+"";
     }
 
   })
 
 })

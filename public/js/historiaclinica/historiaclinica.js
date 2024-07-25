$(document).ready(function() {
    $('select[name="paciente"]').on('change', function() {
        var selectedOption = $(this).find(':selected');
        var fechaNacimiento = selectedOption.data('fecha-nacimiento');
        var edad = calcularEdad(fechaNacimiento);
        $('#edad').val(edad);
    });

    function calcularEdad(fechaNacimiento) {
        var fechaNac = new Date(fechaNacimiento);
        var fechaActual = new Date();
        var edad = fechaActual.getFullYear() - fechaNac.getFullYear();
        var mes = fechaActual.getMonth() - fechaNac.getMonth();
        if (mes < 0 || (mes === 0 && fechaActual.getDate() < fechaNac.getDate())) {
            edad--;
        }
        return edad;
    }

    $('.btn-crear-consulta-generica').on('click', function() {
        const inputAddress = $('#inputAddress').val();
        const sucursal = $('#sucursal').val();

        if( 
            inputAddress <= 0 ||
            sucursal <= 0
        ){

        } else {
            Swal.fire({
                title: 'Cargando...',
                html: `
                    <div 
                    class="spinner-border no-mostrar-btn" role="status"
                    >
                    <span class="sr-only"> Loading...</span>
                    </div>`,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            $(this).addClass('bloqueado-btn')
            $('.txt-btn-crear').addClass('no-mostrar-btn')
            $('.spinner-border').removeClass('no-mostrar-btn')
        } 
    })

});

$('textarea.textarea').maxlength({
    alwaysShow: true,
});
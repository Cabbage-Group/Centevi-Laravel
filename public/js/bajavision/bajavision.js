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
});

$('textarea.textarea').maxlength({
	alwaysShow: true,
});
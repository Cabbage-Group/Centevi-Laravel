<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePacientesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pacientes', function (Blueprint $table) {
            $table->id('id_paciente');
            $table->integer('sucursal');
            $table->string('doctor', 60);
            $table->string('nombres', 90);
            $table->string('apellidos', 90);
            $table->string('nro_cedula', 20);
            $table->string('email', 40);
            $table->string('nro_seguro', 20);
            $table->date('fecha_nacimiento');
            $table->string('genero', 10);
            $table->string('lugar_nacimiento', 15);
            $table->string('direccion', 100);
            $table->string('ocupacion', 60);
            $table->string('telefono', 10);
            $table->string('celular', 10);
            $table->string('medico', 20);
            $table->string('urgencia', 400);
            $table->string('menor', 500);
            $table->date('fecha_creacion');
            $table->timestamps();

            $table->index('sucursal');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pacientes');
    }
}

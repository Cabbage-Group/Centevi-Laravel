<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePacientesmenoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pacientesmenores', function (Blueprint $table) {
            $table->id('id_paciente');
            $table->string('nombres', 80);
            $table->string('apellidos', 80);
            $table->string('nro_cedula', 12);
            $table->string('nro_seguro', 12);
            $table->date('fecha_nacimiento');
            $table->string('genero', 10);
            $table->string('lugar_nacimiento', 30);
            $table->string('direccion', 100);
            $table->string('medico_cabecera', 80);
            $table->string('responsable', 80);
            $table->string('parentesco', 12);
            $table->string('nro_celular_responsable', 10);
            $table->string('otro_nro_responsable', 10);
            $table->string('alergias', 120);
            $table->string('urg_responsable', 80);
            $table->string('urg_parentesto', 20);
            $table->string('urg_celular', 10);
            $table->datetime('fecha_creacion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pacientesmenores');
    }
}

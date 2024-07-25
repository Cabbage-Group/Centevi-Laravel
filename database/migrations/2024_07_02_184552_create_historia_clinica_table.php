<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHistoriaClinicaTable extends Migration
{
    public function up()
    {
        Schema::create('historia_clinica', function (Blueprint $table) {
            $table->integer('id_consulta')->primary();
            $table->integer('sucursal');
            $table->string('doctor', 255);
            $table->integer('paciente');
            $table->integer('id_terapia');
            $table->integer('edad');
            $table->integer('fecha_atencion');
            $table->text('m_c');
        });
    }

    public function down()
    {
        Schema::dropIfExists('historia_clinica');
    }
}

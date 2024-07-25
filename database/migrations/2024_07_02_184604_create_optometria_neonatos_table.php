<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOptometriaNeonatosTable extends Migration
{
    public function up()
    {
        Schema::create('optometria_neonatos', function (Blueprint $table) {
            $table->increments('id_consulta');
            $table->integer('sucursal');
            $table->string('doctor', 255);
            $table->integer('paciente');
            $table->integer('id_terapia');
            $table->integer('edad')->nullable();
            $table->date('fecha_atencion');
            $table->text('m_c');
            $table->string('a_o', 255);
            $table->string('a_p', 255)->nullable();
            $table->string('a_f', 255);
            $table->string('medicamentos', 255);
            $table->string('tratamientos', 255);
            $table->string('desarrollo', 255);
            $table->string('nacimiento', 255);
            $table->string('parto', 255);
            $table->string('gateo', 255);
            $table->string('lenguaje', 255);
            $table->string('complicaciones', 255);
            $table->string('perinatales', 255);
            $table->string('postnatales', 255);
            $table->string('agudeza_visual', 350);
            $table->string('lensometria', 350);
            $table->string('lensometria_extra', 200);
            $table->string('sa_pp', 300);
            $table->string('pruebas_extras', 500);
            $table->string('refraccion', 500);
            $table->text('conducta_seguir');
            $table->text('plan_versiones');
            $table->datetime('fecha_creacion');
            $table->string('editado')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('optometria_neonatos');
    }
}

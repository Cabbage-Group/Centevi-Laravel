<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBajaVisionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('baja_vision', function (Blueprint $table) {
            $table->increments('id_consulta');
            $table->integer('sucursal');
            $table->string('doctor', 30);
            $table->integer('paciente');
            $table->integer('id_terapia');
            $table->tinyInteger('edad');
            $table->date('fecha_atencion');
            $table->text('m_c');
            $table->string('a_o', 10);
            $table->string('a_p', 10);
            $table->string('a_f', 10);
            $table->string('medicamentos', 100);
            $table->string('tratamientos', 100);
            $table->string('dx_oft_princ', 60);
            $table->string('objetivos', 100);
            $table->string('av_sc', 300);
            $table->string('av_cc', 300);
            $table->string('vision_exentrica')->nullable();
            $table->string('lensometria', 400);
            $table->string('lensometria_extra', 300);
            $table->string('cv_so', 200);
            $table->string('amsler', 100);
            $table->string('sensibilidad_c', 100);
            $table->text('refraccion');
            $table->string('pruebas', 200);
            $table->text('ayudas_opticas');
            $table->text('ayudas_no_opticas');
            $table->text('plan_rehabilitacion');
            $table->text('plan_versiones');
            $table->dateTime('fecha_creacion');
            $table->string('editado')->nullable();
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
        Schema::dropIfExists('baja_vision');
    }
}
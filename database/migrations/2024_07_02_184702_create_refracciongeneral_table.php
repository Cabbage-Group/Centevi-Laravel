<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRefracciongeneralTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('refracciongeneral', function (Blueprint $table) {
            $table->id('id_consulta');
            $table->integer('sucursal');
            $table->string('doctor', 255);
            $table->integer('paciente');
            $table->integer('id_terapia');
            $table->integer('edad');
            $table->date('fecha_atencion');
            $table->text('m_c');
            $table->string('a_o', 255);
            $table->string('a_p', 255);
            $table->string('a_f', 255);
            $table->string('medicamentos', 255);
            $table->string('tratamientos', 255);
            $table->string('av_sc', 350);
            $table->string('av_cc', 350);
            $table->string('ojo_dominante', 255)->nullable();
            $table->string('mano_dominante', 255)->nullable();
            $table->string('lensometria', 400);
            $table->string('lensometria_extra', 300);
            $table->string('sa_pp', 400);
            $table->string('visuscopia', 400);
            $table->string('visuscopia_extra', 350);
            $table->string('refraccion', 350);
            $table->string('tipo_lentes', 400);
            $table->string('lentes_contacto', 400);
            $table->string('pruebas', 400);
            $table->string('pruebas_extra', 300);
            $table->string('acomodacion', 400)->nullable();
            $table->string('acomodacion_extra', 300)->nullable();
            $table->text('conducta_seguir');
            $table->text('plan_versiones');
            $table->datetime('fecha_creacion');
            $table->string('editado', 255)->nullable();
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
        Schema::dropIfExists('refracciongeneral');
    }
}

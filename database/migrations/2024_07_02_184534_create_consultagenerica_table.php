<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConsultaGenericaTable extends Migration
{
    public function up()
    {
        Schema::create('consultagenerica', function (Blueprint $table) {
            $table->increments('id_consulta');
            $table->integer('sucursal');
            $table->string('doctor', 255);
            $table->integer('paciente');
            $table->integer('id_terapia');
            $table->integer('edad');
            $table->date('fecha_atencion');
            $table->text('m_c');
            $table->datetime('fecha_creacion');
            $table->string('editado')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('consultagenerica');
    }
}
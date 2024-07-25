<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocumentosPacientesTable extends Migration
{
    public function up()
    {
        Schema::create('documentos_pacientes', function (Blueprint $table) {
            $table->increments('id_documento');
            $table->string('url', 250);
            $table->string('nombre', 120);
            $table->integer('id_paciente');
            $table->date('fecha');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('documentos_pacientes');
    }
}


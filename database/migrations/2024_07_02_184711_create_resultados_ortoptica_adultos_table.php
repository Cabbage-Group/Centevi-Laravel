<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateResultadosOrtopticaAdultosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('resultados_ortoptica_adultos', function (Blueprint $table) {
            $table->id('id_resultado');
            $table->integer('id_consulta');
            $table->text('resultado');
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
        Schema::dropIfExists('resultados_ortoptica_adultos');
    }
}

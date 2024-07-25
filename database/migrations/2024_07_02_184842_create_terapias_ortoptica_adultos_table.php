<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTerapiasOrtopticaAdultosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('terapias_ortoptica_adultos', function (Blueprint $table) {
            $table->id('id_terapia');
            $table->integer('id_paciente');
            $table->text('evaluacion')->nullable();
            $table->string('motivo', 300)->nullable();
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
        Schema::dropIfExists('terapias_ortoptica_adultos');
    }
}

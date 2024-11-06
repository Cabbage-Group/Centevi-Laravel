<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServiciosRealizadosOrtopticaAdultosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('servicios_realizados_ortoptica_adultos', function (Blueprint $table) {
            $table->id();
            $table->Integer('ortopticaAdultos_id');
            $table->unsignedInteger('servicios_id');

            $table->foreign('ortopticaAdultos_id', 'fk_realizados_ortopticaAdultos')->references('id_consulta')->on('ortoptica_adultos')->onDelete('cascade');
            $table->foreign('servicios_id', 'fk_realizados_servicios_ortopticaAdultos')->references('id')->on('servicios')->onDelete('cascade');

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
        Schema::dropIfExists('servicios_realizados_ortoptica_adultos');
    }
}

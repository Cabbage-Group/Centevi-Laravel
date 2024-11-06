<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServiciosRealizadosOptometriaNeonatosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('servicios_realizados_optometria_neonatos', function (Blueprint $table) {
            $table->id();
            $table->Integer('optometriaNeonatos_id');
            $table->unsignedInteger('servicios_id');

            $table->foreign('optometriaNeonatos_id', 'fk_realizados_optometriaNeonatos')->references('id_consulta')->on('optometria_neonatos')->onDelete('cascade');
            $table->foreign('servicios_id', 'fk_realizados_servicios_optometriaNeonatos')->references('id')->on('servicios')->onDelete('cascade');

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
        Schema::dropIfExists('servicios_realizados_optometria_neonatos');
    }
}

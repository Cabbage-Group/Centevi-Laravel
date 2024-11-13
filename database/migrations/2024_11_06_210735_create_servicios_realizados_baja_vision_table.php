<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServiciosRealizadosBajaVisionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('servicios_realizados_baja_vision', function (Blueprint $table) {
            $table->id();
            $table->Integer('bajavision_id');
            $table->unsignedInteger('servicios_id');

            $table->foreign('bajavision_id', 'fk_realizados_bajaVision')->references('id_consulta')->on('baja_vision')->onDelete('cascade');
            $table->foreign('servicios_id', 'fk_realizados_servicios_bajaVision')->references('id')->on('servicios')->onDelete('cascade');

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
        Schema::dropIfExists('servicios_realizados_baja_vision');
    }
}

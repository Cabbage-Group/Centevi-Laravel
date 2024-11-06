<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServiciosProximosBajaVisionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('servicios_proximos_baja_vision', function (Blueprint $table) {
            $table->id();
            $table->Integer('bajavision_id');
            $table->unsignedInteger('servicios_id');

            
            $table->foreign('bajavision_id', 'fk_proximos_optometria_bajaVision')->references('id_consulta')->on('baja_vision')->onDelete('cascade');
            $table->foreign('servicios_id', 'fk_proximos_servicios_bajaVision')->references('id')->on('servicios')->onDelete('cascade');

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
        Schema::dropIfExists('servicios_proximos_baja_vision');
    }
}

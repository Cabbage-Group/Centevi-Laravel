<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServiciosProximosOptometriaPediatricaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('servicios_proximos_optometria_pediatrica', function (Blueprint $table) {
            $table->id();
            $table->Integer('optometriaPediatrica_id');
            $table->unsignedInteger('servicios_id');
            
            $table->foreign('optometriaPediatrica_id', 'fk_proximos_optometriaPediatrica')->references('id_consulta')->on('optometria_pediatrica')->onDelete('cascade');
            $table->foreign('servicios_id', 'fk_proximos_servicios_optometriaPediatrica')->references('id')->on('servicios')->onDelete('cascade');
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
        Schema::dropIfExists('servicios_proximos_optometria_pediatrica');
    }
}

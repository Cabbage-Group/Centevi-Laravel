<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCitasServiciosTable extends Migration
{
  
    public function up()
    {
        Schema::create('citas_servicios', function (Blueprint $table) {
            $table->id();
            $table->Integer('cita_id'); 
            $table->unsignedBigInteger('servicios_id'); 
            $table->foreign('cita_id')->references('id')->on('citas')->onDelete('cascade');
            $table->timestamps();
        });
    }

   
    public function down()
    {
        Schema::dropIfExists('citas_servicios');
    }
}

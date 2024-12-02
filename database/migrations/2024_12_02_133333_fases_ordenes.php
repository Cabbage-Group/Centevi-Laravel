<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class FasesOrdenes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fases_ordenes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tipo_fase_orden_id')->constrained('tipos_fases_ordenes')->onDelete('cascade'); 
            $table->integer('ordenes_id');
            $table->string('laboratorio', 45)->nullable(); 
            $table->string('observacion', 200)->nullable();
            $table->string('fecha_fase', 45)->nullable(); 
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
        Schema::dropIfExists('fases_ordenes'); 
    }
}

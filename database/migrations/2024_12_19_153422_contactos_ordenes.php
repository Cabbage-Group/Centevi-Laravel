<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ContactosOrdenes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contactos_ordenes', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('ordenes_id')->references('id_orden')->on('ordenes')->onDelete('cascade');
            $table->foreignId('fase_orden_id')->constrained('fases_ordenes')->onDelete('cascade');
            $table->integer('usuario_id')->references('id_usuario')->on('usuarios')->onDelete('cascade');
            $table->unsignedInteger('cantidad')->default(0); 
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
        Schema::dropIfExists('contactos_ordenes');
    }
}

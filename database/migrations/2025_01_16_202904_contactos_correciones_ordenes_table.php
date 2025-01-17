<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ContactosCorrecionesOrdenesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contactos_correciones_ordenes', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('correccion_ordenes_id')->constrained('correciones_ordenes')->onDelete('cascade');
            $table->foreignId('tipo_fase_cr_orden_id')->constrained('tipos_fases_ordenes')->onDelete('cascade');
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
        Schema::dropIfExists('contactos_correciones_ordenes');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class FasesCorreccionOrdenesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fases_correcciones_ordenes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tipo_fase_correccion_orden_id')->constrained('tipos_fases_ordenes')->onDelete('cascade');
            $table->foreignId('correccion_ordenes_id')->constrained('correciones_ordenes')->onDelete('cascade');
            $table->string('laboratorio', 45)->nullable();
            $table->string('observacion', 400)->nullable();
            $table->string('fecha_fase', 45)->nullable();
            $table->tinyInteger('status')->nullable();
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
        Schema::dropIfExists('fases_correcciones_ordenes');
    }
}

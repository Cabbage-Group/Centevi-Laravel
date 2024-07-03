<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRecetaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('receta', function (Blueprint $table) {
            $table->id('id_receta');
            $table->integer('id_paciente');
            $table->string('nro_receta', 50);
            $table->string('direccion', 200);
            $table->string('cedula', 60);
            $table->string('telefono', 60);
            $table->text('rx');
            $table->text('tipo_lente');
            $table->text('material');
            $table->text('tratamientos');
            $table->text('aro_propio');
            $table->string('observacion', 400);
            $table->integer('sucursal');
            $table->string('doctor', 60);
            $table->datetime('fecha_creacion');
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
        Schema::dropIfExists('receta');
    }
}

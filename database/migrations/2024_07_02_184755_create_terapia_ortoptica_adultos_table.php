<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTerapiaOrtopticaAdultosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('terapia_ortoptica_adultos', function (Blueprint $table) {
            $table->id();
            $table->integer('id_terapia');
            $table->text('sesion')->nullable();
            $table->tinyInteger('completado')->nullable();
            $table->tinyInteger('pagado')->nullable();
            $table->string('doctor', 60);
            $table->datetime('fecha_creacion');
            $table->integer('sucursal')->nullable();
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
        Schema::dropIfExists('terapia_ortoptica_adultos');
    }
}

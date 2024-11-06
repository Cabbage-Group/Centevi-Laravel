<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServiciosRealizadosOptometriaGeneralTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('servicios_realizados_optometria_general', function (Blueprint $table) {
            $table->id();
            $table->Integer('optometriageneral_id');
            $table->unsignedInteger('servicios_id');

            $table->foreign('optometriageneral_id', 'fk_realizados_optometria')->references('id_consulta')->on('refracciongeneral')->onDelete('cascade');
            $table->foreign('servicios_id', 'fk_realizados_servicios_optometria')->references('id')->on('servicios')->onDelete('cascade');

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
        Schema::dropIfExists('servicios_realizados_optometria_general');
    }
}

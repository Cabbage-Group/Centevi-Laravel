<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServiciosProximosHistoriasClinicasTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('servicios_proximos_historias_clinicas', function (Blueprint $table) {
      $table->id();
      $table->Integer('historiaclinica_id');
      $table->unsignedInteger('servicios_id');

      $table->foreign('historiaclinica_id', 'fk_proximos_historia')->references('id_consulta')->on('consultagenerica')->onDelete('cascade');
      $table->foreign('servicios_id', 'fk_proximos_servicios')->references('id')->on('servicios')->onDelete('cascade');

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
    Schema::dropIfExists('servicios_proximos_historias_clinicas');
  }
}

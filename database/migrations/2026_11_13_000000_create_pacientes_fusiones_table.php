<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up()
  {
    Schema::create('pacientes_fusiones', function (Blueprint $table) {
      $table->id();
      $table->integer('id_principal')->index();
      $table->integer('id_duplicado')->index();
      $table->longText('principal_antes');
      $table->longText('duplicado_antes');
      $table->text('referencias_movidas');
      $table->string('usuario', 100)->nullable();
      $table->timestamp('created_at')->nullable();
    });

    // Filas movidas en cada fusión (lo llena el procedimiento SQL fusionar_paciente)
    Schema::create('pacientes_fusiones_detalle', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('id_fusion')->index();
      $table->string('tabla', 64);
      $table->string('columna', 64);
      $table->bigInteger('id_fila');
    });
  }

  public function down()
  {
    Schema::dropIfExists('pacientes_fusiones_detalle');
    Schema::dropIfExists('pacientes_fusiones');
  }
};

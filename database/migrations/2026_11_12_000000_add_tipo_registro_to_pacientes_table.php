<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up()
  {
    Schema::table('pacientes', function (Blueprint $table) {
      $table->string('tipo_registro', 20)->default('cliente/paciente')->after('codigo');
      $table->index('tipo_registro');
    });

    DB::table('pacientes')->update(['tipo_registro' => 'cliente/paciente']);
  }

  public function down()
  {
    Schema::table('pacientes', function (Blueprint $table) {
      $table->dropIndex(['tipo_registro']);
      $table->dropColumn('tipo_registro');
    });
  }
};

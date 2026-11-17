<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up()
  {
    Schema::table('ordenes', function (Blueprint $table) {
      $table->integer('id_cliente')->nullable()->after('id_paciente');
      $table->index('id_cliente');
    });

    DB::table('ordenes')->whereNull('id_cliente')->update(['id_cliente' => DB::raw('id_paciente')]);
  }

  public function down()
  {
    Schema::table('ordenes', function (Blueprint $table) {
      $table->dropIndex(['id_cliente']);
      $table->dropColumn('id_cliente');
    });
  }
};

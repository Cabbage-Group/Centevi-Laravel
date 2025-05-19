<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeyToFasesOrdenesTable extends Migration
{
    public function up()
    {
        Schema::table('fases_ordenes', function (Blueprint $table) {
            $table->unsignedBigInteger('ordenes_id')->change(); // Asegura que sea BIGINT UNSIGNED
        });
    }

    public function down()
    {
        Schema::table('fases_ordenes', function (Blueprint $table) {
            $table->dropForeign(['ordenes_id']);
        });
    }
}

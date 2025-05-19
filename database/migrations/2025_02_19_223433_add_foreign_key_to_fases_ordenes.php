<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeyToFasesOrdenes extends Migration
{
    public function up()
    {
        Schema::table('fases_ordenes', function (Blueprint $table) {
            $table->unsignedBigInteger('ordenes_id')->change();
            $table->foreign('ordenes_id')->references('id_orden')->on('ordenes')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('fases_ordenes', function (Blueprint $table) {
            $table->dropForeign(['ordenes_id']);
        });
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeyToCorrecionesOrdenes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('correciones_ordenes', function (Blueprint $table) {
            $table->foreign('ordenes_id')->references('id_orden')->on('ordenes')->onDelete('cascade');
        });
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('correciones_ordenes', function (Blueprint $table) {
            $table->dropForeign(['ordenes_id']);
        });
    }
}

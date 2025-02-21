<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeyToFasesCorreccionesOrdenes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fases_correcciones_ordenes', function (Blueprint $table) {
            $table->integer('correccion_ordenes_id')->change();
            $table->foreign('correccion_ordenes_id')->references('id')->on('correciones_ordenes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fases_correcciones_ordenes', function (Blueprint $table) {
            $table->dropForeign(['correccion_ordenes_id']);
        });
    }
}

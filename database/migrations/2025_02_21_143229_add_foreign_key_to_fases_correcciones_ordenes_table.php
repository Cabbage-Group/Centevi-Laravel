<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeyToFasesCorreccionesOrdenesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fases_correcciones_ordenes', function (Blueprint $table) {
            $table->unsignedBigInteger('correccion_ordenes_id')->change();
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

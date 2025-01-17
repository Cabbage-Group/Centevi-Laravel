<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNroOrdenIdToOrdenesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ordenes', function (Blueprint $table) {
            Schema::table('ordenes', function (Blueprint $table) {
                $table->unsignedBigInteger('nro_orden_id')->nullable();
                $table->foreign('nro_orden_id')->references('id')->on('nro_ordenes')->onDelete('cascade');
            });
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ordenes', function (Blueprint $table) {
            $table->dropForeign(['nro_orden_id']);
            // Eliminar la columna nro_orden_id
            $table->dropColumn('nro_orden_id');
        });
    }
}

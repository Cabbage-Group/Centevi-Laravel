<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyOrdenesIdInCorrecionesOrdenes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('correciones_ordenes', function (Blueprint $table) {
            $table->unsignedBigInteger('ordenes_id')->nullable()->change(); // Cambiar a BIGINT UNSIGNED
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
            $table->integer('ordenes_id')->nullable()->change(); // Revertir cambio en rollback
        });
    }
}

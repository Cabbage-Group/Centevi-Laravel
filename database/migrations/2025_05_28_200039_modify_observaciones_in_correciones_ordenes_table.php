<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyObservacionesInCorrecionesOrdenesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('correciones_ordenes', function (Blueprint $table) {
            $table->string('observaciones', 255)->nullable()->change();
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
            $table->string('observaciones', 100)->nullable()->change();
        });
    }
}

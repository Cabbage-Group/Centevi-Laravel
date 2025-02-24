<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddElaboradoPorToFasesCorreccionesOrdenesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fases_correcciones_ordenes', function (Blueprint $table) {
            $table->integer('elaborado_por')->nullable()->after('status');
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
            $table->dropColumn('elaborado_por');
        });
    }
}

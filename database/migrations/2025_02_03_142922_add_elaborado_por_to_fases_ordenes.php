<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddElaboradoPorToFasesOrdenes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::table('fases_ordenes', function (Blueprint $table) {
        $table->unsignedBigInteger('elaborado_por')->nullable()->after('status');
    });
}


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fases_ordenes', function (Blueprint $table) {
            $table->dropColumn('elaborado_por');
        });
    }
}

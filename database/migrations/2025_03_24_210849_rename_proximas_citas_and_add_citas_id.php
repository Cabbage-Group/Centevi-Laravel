<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameProximasCitasAndAddCitasId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::rename('proximas_citas', 'citas');

        Schema::table('citas', function (Blueprint $table) {
            $table->unsignedBigInteger('citas_id')->nullable()->after('id');
            $table->foreign('citas_id')->references('id')->on('citas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('citas', function (Blueprint $table) {
            $table->dropForeign(['citas_id']);
            $table->dropColumn('citas_id');
        });
        Schema::rename('citas', 'proximas_citas');
    }
}

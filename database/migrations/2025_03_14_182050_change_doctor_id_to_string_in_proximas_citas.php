<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeDoctorIdToStringInProximasCitas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('proximas_citas', function (Blueprint $table) {
            $table->string('doctor_id')->nullable()->change(); // Convertir a string y permitir valores nulos
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('proximas_citas', function (Blueprint $table) {
            $table->unsignedBigInteger('doctor_id')->nullable()->change(); // Revertir a bigint en caso de rollback
        });
    }
}

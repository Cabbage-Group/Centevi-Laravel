<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPacienteInfoToCitasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('citas', function (Blueprint $table) {
            $table->string('nombres')->nullable()->after('paciente_id');
            $table->string('apellidos')->nullable()->after('nombres');
            $table->string('celular')->nullable()->after('apellidos');
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
            $table->dropColumn(['nombres', 'apellidos', 'celular']);
        });
    }
}

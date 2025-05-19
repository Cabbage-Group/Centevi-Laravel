<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAgendadoPorToCitasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('citas', function (Blueprint $table) {
            $table->string('agendado_por')->nullable()->after('comentarios');
        });
    }

    public function down()
    {
        Schema::table('citas', function (Blueprint $table) {
            $table->dropColumn('agendado_por');
        });
    }
}

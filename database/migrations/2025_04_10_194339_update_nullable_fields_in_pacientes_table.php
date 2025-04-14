<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateNullableFieldsInPacientesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pacientes', function (Blueprint $table) {
            $table->integer('sucursal')->nullable()->change();
            $table->date('fecha_creacion')->nullable()->change();
            $table->boolean('estado')->default(true)->after('fecha_creacion');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pacientes', function (Blueprint $table) {
            $table->integer('sucursal')->nullable(false)->change();
            $table->date('fecha_creacion')->nullable(false)->change();
            $table->dropColumn('estado');
        });
    }
}

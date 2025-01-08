<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCelularInPacientesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pacientes', function (Blueprint $table) {
            // Modificar el tamaño del campo 'celular'
            $table->string('celular', 50)->change(); // Cambiar longitud a 50 caracteres
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
            // Revertir el tamaño del campo 'celular' a 30 caracteres
            $table->string('celular', 30)->change();
        });
    }
}

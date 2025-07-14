<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class NroCedulaNullableInPacientesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE pacientes MODIFY nro_cedula VARCHAR(20) NULL");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */

    public function down(): void
    {
        DB::statement("ALTER TABLE pacientes MODIFY nro_cedula VARCHAR(20) NOT NULL");
    }
}

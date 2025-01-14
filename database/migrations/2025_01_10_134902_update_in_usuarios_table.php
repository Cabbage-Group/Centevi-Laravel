<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class UpdateInUsuariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("SET SESSION sql_mode=''");
        DB::statement("UPDATE usuarios SET editado = NULL WHERE editado = '0000-00-00' OR editado = '0000-00-00 00:00:00'");
        
        Schema::table('usuarios', function (Blueprint $table) {
            $table->integer('sucursal')->nullable()->change(); 
            $table->string('foto')->nullable()->change();
        });

        DB::statement("SET SESSION sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ENGINE_SUBSTITUTION'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->integer('sucursal')->nullable(false)->change(); 
            $table->string('foto')->nullable(false)->change(); 
        });
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateUbicacionMapsInSucursalesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sucursales', function (Blueprint $table) {          
            $table->string('ubicacion_maps', 800)->change(); // Cambiar longitud a 50 caracteres
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sucursales', function (Blueprint $table) {
            $table->string('ubicacion_maps', 800)->change();
        });
    }
}

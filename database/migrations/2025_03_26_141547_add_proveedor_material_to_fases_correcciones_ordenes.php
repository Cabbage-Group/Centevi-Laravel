<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddProveedorMaterialToFasesCorreccionesOrdenes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fases_correcciones_ordenes', function (Blueprint $table) {
            $table->string('proveedor_material', 3000)->nullable()->after('observacion');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fases_correcciones_ordenes', function (Blueprint $table) {
            $table->dropColumn('proveedor_material');
        });
    }
}

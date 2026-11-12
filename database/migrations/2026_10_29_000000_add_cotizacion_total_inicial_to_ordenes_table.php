<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCotizacionTotalInicialToOrdenesTable extends Migration
{
    public function up()
    {
        Schema::table('ordenes', function (Blueprint $table) {
            // Primer total devuelto por Interfuerza; cotizacion_total guarda el último
            $table->decimal('cotizacion_total_inicial', 12, 2)->nullable()->after('cotizacion_total');
        });
    }

    public function down(): void
    {
        Schema::table('ordenes', function (Blueprint $table) {
            $table->dropColumn('cotizacion_total_inicial');
        });
    }
}

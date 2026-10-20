<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDatosCotizacionToOrdenesTable extends Migration
{
    public function up()
    {
        Schema::table('ordenes', function (Blueprint $table) {
            $table->string('cotizacion_estado', 100)->nullable()->after('nro_cotizacion');
            $table->string('cotizacion_fecha', 50)->nullable()->after('cotizacion_estado');
            $table->decimal('cotizacion_subtotal', 12, 2)->nullable()->after('cotizacion_fecha');
            $table->decimal('cotizacion_total', 12, 2)->nullable()->after('cotizacion_subtotal');
        });
    }

    public function down(): void
    {
        Schema::table('ordenes', function (Blueprint $table) {
            $table->dropColumn(['cotizacion_estado', 'cotizacion_fecha', 'cotizacion_subtotal', 'cotizacion_total']);
        });
    }
}

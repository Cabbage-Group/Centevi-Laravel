<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSaldoPorCobrarToOrdenesTable extends Migration
{
    public function up()
    {
        Schema::table('ordenes', function (Blueprint $table) {
            $table->decimal('saldo_por_cobrar', 12, 2)->nullable()->after('cotizacion_total');
        });
    }

    public function down(): void
    {
        Schema::table('ordenes', function (Blueprint $table) {
            $table->dropColumn('saldo_por_cobrar');
        });
    }
}

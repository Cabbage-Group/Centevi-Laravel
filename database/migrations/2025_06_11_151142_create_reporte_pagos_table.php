<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReportePagosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reporte_pagos', function (Blueprint $table) {
            $table->id();
            $table->string('cobro_anticipo_id')->nullable();
            $table->date('cobro_anticipo_fecha')->nullable();
            $table->string('cobro_anticipo_comentario')->nullable();
            $table->string('cobro_anticipo_referencia')->nullable();
            $table->string('cobro_anticipo_tipo')->nullable();
            $table->string('cobro_anticipo_pos')->nullable();
            $table->string('cobro_anticipo_bodega')->nullable();
            $table->string('cobro_anticipo_proyecto')->nullable();
            $table->string('cobro_anticipo_abono_ref')->nullable();
            $table->string('cobro_anticipo_fiscal_id')->nullable();
            $table->double('cobro_anticipo_monto')->default(0);
            $table->double('cobro_anticipo_balance')->default(0);
            $table->date('cobro_anticipo_fecha_pago_fin')->nullable();

            $table->string('cobro_aplicado_pago')->nullable();
            $table->string('cobro_aplicado_ciudad')->nullable();
            $table->string('cobro_aplicado_pais')->nullable();
            $table->date('cobro_aplicado_fecha')->nullable();

            $table->string('cobro_aplicado_factura')->nullable();
            $table->string('cobro_aplicado_vendedor')->nullable();
            $table->string('cobro_aplicado_tipo')->nullable();
            $table->string('cobro_aplicado_tipo_trans')->nullable();
            $table->string('cobro_aplicado_ref')->nullable();
            $table->string('cobro_aplicado_agente')->nullable();
            $table->string('cobro_aplicado_caja')->nullable();
            $table->string('cobro_aplicado_monto')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reporte_pagos');
    }
}

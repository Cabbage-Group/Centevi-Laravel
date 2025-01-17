<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CorrecionesOrdenesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('correciones_ordenes', function (Blueprint $table) {
            $table->id('id');
            $table->foreignId('ordenes_id')->references('id_orden')->on('ordenes')->onDelete('cascade');
            $table->integer('elaborado_por')->nullable();
            $table->string('esfera_od', 100)->nullable();
            $table->string('esfera_oi', 100)->nullable();
            $table->string('cilindro_od', 100)->nullable();
            $table->string('cilindro_oi', 100)->nullable();
            $table->string('eje_od', 100)->nullable();
            $table->string('eje_oi', 100)->nullable();
            $table->string('add_od', 100)->nullable();
            $table->string('add_oi', 100)->nullable();
            $table->string('prisma_od', 100)->nullable();
            $table->string('prisma_oi', 100)->nullable();
            $table->string('distancia_od', 100)->nullable();
            $table->string('distancia_oi', 100)->nullable();
            $table->string('altura_od', 100)->nullable();
            $table->string('altura_oi', 100)->nullable();
            $table->string('tipo_cristal_od', 100)->nullable();
            $table->string('tipo_cristal_oi', 100)->nullable();
            $table->string('material_od', 100)->nullable();
            $table->string('material_oi', 100)->nullable();
            $table->string('tratamientos_od', 100)->nullable();
            $table->string('tratamientos_oi', 100)->nullable();
            $table->tinyInteger('aro_centevi')->unsigned()->nullable();
            $table->tinyInteger('aro_propio')->unsigned()->nullable();
            $table->string('codigo', 100)->nullable()->nullable();
            $table->string('color', 100)->nullable()->nullable();
            $table->string('marca', 100)->nullable()->nullable();
            $table->string('tipo_aro', 100)->nullable();
            $table->string('doctor', 100)->nullable();
            $table->string('observaciones', 400)->nullable()->nullable();
            $table->string('l_uno', 100)->nullable();
            $table->string('l_dos', 100)->nullable();
            $table->string('l_tres', 100)->nullable();
            $table->string('l_cuatro', 100)->nullable();
            $table->string('l_cinco', 100)->nullable();
            $table->tinyInteger('pagado')->nullable();
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
        Schema::dropIfExists('correciones_ordenes');
    }
}

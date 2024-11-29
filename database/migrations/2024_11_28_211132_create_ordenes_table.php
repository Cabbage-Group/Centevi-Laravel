<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdenesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ordenes', function (Blueprint $table) {
            $table->id('id_orden');
            $table->integer('nro_orden')->unique();
            $table->integer('id_paciente');
            $table->integer('id_sucursal');
            $table->integer('elaborado_por');
            $table->string('esfera_od', 50);
            $table->string('esfera_oi', 50);
            $table->string('cilindro_od', 50);
            $table->string('cilindro_oi', 50);
            $table->string('eje_od', 50);
            $table->string('eje_oi', 50);
            $table->string('add_od', 50);
            $table->string('add_oi', 50);
            $table->string('prisma_od', 50);
            $table->string('prisma_oi', 50);
            $table->string('distancia_od', 50);
            $table->string('distancia_oi', 50);
            $table->string('altura_od', 50);
            $table->string('altura_oi', 50);
            $table->string('tipo_cristal_od', 50);
            $table->string('tipo_cristal_oi', 50);
            $table->string('material_od', 50);
            $table->string('material_oi', 50);
            $table->string('tratamientos_od', 50);
            $table->string('tratamientos_oi', 50);
            $table->tinyInteger('aro_centevi')->unsigned();
            $table->tinyInteger('aro_propio')->unsigned();;
            $table->string('codigo', 50);
            $table->string('color', 50);
            $table->string('marca', 50);
            $table->string('tipo_aro', 50);
            $table->string('doctor', 50);
            $table->string('observaciones', 50);
            $table->string('l_uno', 50);
            $table->string('l_dos', 50);
            $table->string('l_tres', 50);
            $table->string('l_cuatro', 50);
            $table->string('l_cinco', 50);
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
        Schema::dropIfExists('ordenes');
    }
}

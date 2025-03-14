<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProximasCitasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('proximas_citas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('origen_id'); // ID del registro en su tabla de origen
            $table->string('origen_tabla'); // Nombre de la tabla de origen (Ej: 'optometria_pediatrica')
            $table->dateTime('fecha_hora');
            $table->enum('tipo', ['consulta', 'terapia']);
            $table->unsignedBigInteger('paciente_id');
            $table->unsignedBigInteger('doctor_id')->nullable();
            $table->unsignedBigInteger('sucursal_id')->nullable();
            $table->text('comentarios')->nullable();
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
        Schema::dropIfExists('proximas_citas');
    }
}

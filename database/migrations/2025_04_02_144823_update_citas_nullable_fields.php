<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCitasNullableFields extends Migration
{
  
    public function up()
    {
        Schema::table('citas', function (Blueprint $table) {
            $table->bigInteger('citas_id')->unsigned()->nullable()->change();
            $table->integer('origen_id')->nullable()->change();
            $table->string('origen_tabla', 250)->nullable()->change();
            $table->string('tipo', 150)->nullable()->change();
            $table->integer('paciente_id')->nullable()->change();
            $table->string('doctor', 250)->nullable()->change();
            $table->integer('sucursal_id')->nullable()->change();
            $table->text('comentarios')->nullable()->change();
            $table->string('agendado_por', 255)->nullable()->change();
        });
    }

   
    public function down()
    {
        Schema::table('citas', function (Blueprint $table) {
            $table->bigInteger('citas_id')->unsigned()->nullable(false)->change();
            $table->integer('origen_id')->nullable(false)->change();
            $table->string('origen_tabla', 250)->nullable(false)->change();
            $table->string('tipo', 150)->nullable(false)->change();
            $table->integer('paciente_id')->nullable(false)->change();
            $table->string('doctor', 250)->nullable(false)->change();
            $table->integer('sucursal_id')->nullable(false)->change();
            $table->text('comentarios')->nullable(false)->change();
            $table->string('agendado_por', 255)->nullable(false)->change();
        });
    }
}

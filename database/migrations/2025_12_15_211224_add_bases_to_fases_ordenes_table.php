<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBasesToFasesOrdenesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fases_ordenes', function (Blueprint $table) {
            // Foreign keys
            $table->unsignedBigInteger('base_ojo_izquierdo_id')->nullable();
            $table->unsignedBigInteger('base_ojo_derecho_id')->nullable()->after('base_ojo_izquierdo_id');

            // Relaciones
            $table->foreign('base_ojo_izquierdo_id')
                ->references('id')
                ->on('bases')
                ->nullOnDelete();

            $table->foreign('base_ojo_derecho_id')
                ->references('id')
                ->on('bases')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fases_ordenes', function (Blueprint $table) {
            // Eliminar foreign keys
            $table->dropForeign(['base_ojo_izquierdo_id']);
            $table->dropForeign(['base_ojo_derecho_id']);

            // Eliminar columnas
            $table->dropColumn([
                'base_ojo_izquierdo_id',
                'base_ojo_derecho_id',
            ]);
        });
    }
}

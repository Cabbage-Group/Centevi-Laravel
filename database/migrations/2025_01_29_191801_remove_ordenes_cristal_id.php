<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveOrdenesCristalId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ordenes', function (Blueprint $table) {
            $table->dropForeign(['cristal_id']); // Elimina la clave foránea si existe
            $table->dropColumn('cristal_id'); // Elimina la columna
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ordenes', function (Blueprint $table) {
            $table->unsignedBigInteger('cristal_id')->nullable(); // Vuelve a agregar la columna
            $table->foreign('cristal_id')->references('id')->on('cristales')->onDelete('cascade'); // Restablece la clave foránea si aplicaba
        });
    }
}

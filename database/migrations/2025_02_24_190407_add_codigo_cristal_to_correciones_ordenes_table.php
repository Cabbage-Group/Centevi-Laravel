<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCodigoCristalToCorrecionesOrdenesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('correciones_ordenes', function (Blueprint $table) {
            $table->string('codigo_cristal', 200)->nullable()->after('pagado');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('correciones_ordenes', function (Blueprint $table) {
            $table->dropColumn('codigo_cristal');
        });
    }
}

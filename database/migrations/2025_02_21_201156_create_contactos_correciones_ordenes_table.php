<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContactosCorrecionesOrdenesTable extends Migration
{
    public function up()
    {
        Schema::table('contactos_correciones_ordenes', function (Blueprint $table) {
            $table->dropColumn('id');
        });

        Schema::table('contactos_correciones_ordenes', function (Blueprint $table) {
            $table->bigIncrements('id'); 
        });
    }

    public function down()
    {
        Schema::table('contactos_correciones_ordenes', function (Blueprint $table) {
            $table->dropColumn('id');
            $table->integer('id')->nullable();
        });
    }
}

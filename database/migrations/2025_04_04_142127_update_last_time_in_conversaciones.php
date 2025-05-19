<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateLastTimeInConversaciones extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('conversaciones', function (Blueprint $table) {
            $table->dateTime('lastTime')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('conversaciones', function (Blueprint $table) {
            $table->string('lastTime', 255)->nullable()->change();
        });
    }
}

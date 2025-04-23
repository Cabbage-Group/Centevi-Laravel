<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class UpdateStatusAndReservarProductosInQuotesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('quotes', function (Blueprint $table) {
            DB::statement("ALTER TABLE `quotes` CHANGE `Status` `Status` ENUM('ACTIVE', 'BILLED', 'APROVED', 'EXPIRED', 'CANCELLED') COLLATE utf8mb4_unicode_ci DEFAULT NULL");

            DB::statement("ALTER TABLE `quotes` CHANGE `Reservar_Productos` `Reservar_Productos` ENUM('YES', 'NO') COLLATE utf8mb4_unicode_ci DEFAULT 'NO'");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('quotes', function (Blueprint $table) {
            DB::statement("ALTER TABLE `quotes` CHANGE `Status` `Status` ENUM('ACTIVE', 'INACTIVE') COLLATE utf8mb4_unicode_ci DEFAULT NULL");

            DB::statement("ALTER TABLE `quotes` CHANGE `Reservar_Productos` `Reservar_Productos` ENUM('SI', 'NO') COLLATE utf8mb4_unicode_ci DEFAULT 'NO'");
        });
    }
}

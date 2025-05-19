<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuotesLinesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quotes_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quote_id')->constrained('quotes')->onDelete('cascade');
            $table->string('Codigo');
            $table->string('Item_Number')->nullable();
            $table->string('Nombre')->nullable();
            $table->string('Marca')->nullable();
            $table->string('Descripcion')->nullable();
            $table->string('Category_L1')->nullable();
            $table->string('Category_L2')->nullable();
            $table->string('Category_L3')->nullable();
            $table->decimal('Unidades', 10, 2)->nullable();
            $table->decimal('Precio_Unitario', 10, 4)->nullable();
            $table->decimal('Discount', 10, 2)->nullable();
            $table->decimal('DiscountFactor', 10, 2)->nullable();
            $table->string('TaxID')->nullable();
            $table->string('TaxName')->nullable();
            $table->decimal('TaxFactor', 10, 2)->nullable();
            $table->decimal('TaxValue', 10, 4)->nullable();
            $table->decimal('Total', 10, 2)->nullable();
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
        Schema::dropIfExists('quotes_lines');
    }
}

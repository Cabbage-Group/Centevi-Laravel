<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuotesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->string('Cliente');
            $table->string('Bodega');
            $table->enum('Status', ['ACTIVE', 'INACTIVE'])->nullable();
            $table->date('Date')->nullable();
            $table->date('Expira')->nullable();
            $table->text('Comentario')->nullable();
            $table->decimal('SubTotal', 10, 2)->nullable();
            $table->decimal('Discount', 10, 2)->nullable();
            $table->decimal('Taxes', 10, 2)->nullable();
            $table->decimal('Total', 10, 2)->nullable();
            $table->json('extraData')->nullable();
            $table->enum('Reservar_Productos', ['SI', 'NO'])->default('NO')->nullable();
            $table->string('Type')->nullable();
            $table->string('Vendedor')->nullable();
            $table->string('Currency')->default('USD')->nullable();
            $table->decimal('Currency_Rate', 15, 9)->default(1.000000000)->nullable();
            $table->boolean('estado')->nullable();
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
        Schema::dropIfExists('quotes');
    }
}

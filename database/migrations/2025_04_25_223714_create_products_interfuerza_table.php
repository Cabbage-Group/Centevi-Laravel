<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsInterfuerzaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products_interfuerza', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique();
            $table->string('type')->nullable();
            $table->string('prod_madre')->nullable();
            $table->string('upc_code')->nullable();
            $table->string('item_number')->nullable();
            $table->string('nombre')->nullable();;
            $table->string('category_l1')->nullable();;
            $table->string('category_l2')->nullable();;
            $table->string('category_l3')->nullable();
            $table->string('codigo_externo')->nullable();
            $table->string('proveedor_principal')->nullable();
            $table->decimal('setup', 10, 2)->nullable();
            $table->decimal('ultimo_costo_unidad', 10, 2)->nullable();
            $table->decimal('peso', 10, 2)->nullable();
            $table->text('detalle')->nullable();
            $table->string('status')->nullable();
            $table->string('marca')->nullable();
            $table->decimal('grosor', 10, 2)->nullable();
            $table->decimal('ancho', 10, 2)->nullable();
            $table->decimal('altura', 10, 2)->nullable();
            $table->decimal('largo', 10, 2)->nullable();
            $table->char('matrix', 1)->nullable();
            $table->char('matrix_child', 1)->nullable();
            $table->string('color')->nullable();
            $table->string('talla')->nullable();
            $table->decimal('tax', 5, 2)->nullable();
            $table->decimal('volumen', 10, 2)->nullable();
            $table->string('lote')->nullable();
            $table->date('expiracion')->nullable();
            $table->boolean('has_promotion')->nullable();
            $table->string('has_promotion_type')->nullable();
            $table->decimal('has_promotion_value', 10, 2)->nullable();
            $table->decimal('has_promotion_default_price', 10, 2)->nullable();
            $table->date('has_promotion_date')->nullable();
            $table->decimal('service_price', 10, 2)->nullable();
            $table->decimal('service_setup', 10, 2)->nullable();

            $table->json('tags')->nullable();

            $table->timestamps();
        });

        Schema::create('product_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                ->constrained('products_interfuerza')
                ->onDelete('cascade');
            $table->string('price_list');
            $table->decimal('price', 10, 2);

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
        Schema::dropIfExists('product_prices');
        Schema::dropIfExists('products_interfuerza');
    }
}

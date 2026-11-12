<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFavoritosUsuariosTable extends Migration
{
    public function up()
    {
        Schema::create('favoritos_usuarios', function (Blueprint $table) {
            $table->id('id_favorito');
            $table->unsignedBigInteger('id_usuario');
            $table->string('url', 255);
            $table->string('titulo', 150);
            $table->string('modulo', 100)->nullable();
            $table->timestamps();

            $table->unique(['id_usuario', 'url']);
            $table->index('id_usuario');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favoritos_usuarios');
    }
}

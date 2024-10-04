<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsuariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id('id_usuario');
            $table->string('usuario', 40);
            $table->string('nombre', 60);
            $table->string('password', 60);
            $table->text('perfil');
            $table->integer('sucursal');
            $table->text('foto');
            $table->integer('estado')->nullable();
            $table->datetime('ultimo_login')->nullable();
            $table->date('editado')->nullable();
            $table->foreignId('tipo_usuario_id')->constrained('tipos_usuarios')->onDelete('cascade'); // Relación con tipos_usuarios
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
        Schema::dropIfExists('usuarios');
    }
}

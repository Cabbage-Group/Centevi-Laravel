<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FavoritoUsuario extends Model
{
  protected $table = 'favoritos_usuarios';

  protected $primaryKey = 'id_favorito';

  protected $fillable = ['id_usuario', 'url', 'titulo', 'modulo'];

  protected $casts = [
    'id_favorito' => 'integer',
    'id_usuario' => 'integer',
  ];
}

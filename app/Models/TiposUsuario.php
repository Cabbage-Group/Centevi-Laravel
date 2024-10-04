<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TiposUsuario extends Model
{   
    protected $table = 'tipos_usuarios';

    protected $fillable = ['tipo_usuario'];

    public function usuarios()
    {
        return $this->hasMany(Usuarios::class); 
    }

    public function permisosTiposUsuarios()
    {
        return $this->hasMany(PermisosTiposUsuarios::class, 'tipo_usuario_id');
    }

    
 
    use HasFactory;
}

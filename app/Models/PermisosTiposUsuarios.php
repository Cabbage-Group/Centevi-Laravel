<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PermisosTiposUsuarios extends Model
{
    use HasFactory;

    protected $table = 'permisos_tipos_usuarios';

    protected $fillable = ['permiso_id', 'tipo_usuario_id'];

    public function permisos()
    {
        return $this->belongsTo(Permisos::class, 'permiso_id');
    }

    public function tiposUsuarios()
    {
        return $this->belongsTo(TiposUsuario::class, 'tipo_usuario_id');
    }
}

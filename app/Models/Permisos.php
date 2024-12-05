<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permisos extends Model
{
    use HasFactory;

    protected $table = 'permisos';

    protected $fillable = ['tipo_permiso_id', 'slug', 'ruta', 'descripcion'];

    public function tiposPermisos()
    {
        return $this->belongsTo(TiposPermisos::class, 'tipo_permiso_id');
    }

    public function permisosTiposUsuarios()
    {
        return $this->hasMany(PermisosTiposUsuarios::class, 'permiso_id');
    }
}

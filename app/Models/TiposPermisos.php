<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TiposPermisos extends Model
{
    use HasFactory;
    
    protected $table = 'tipos_permisos';

    protected $fillable = ['tipo'];

    public function permisos()
    {
        return $this->hasMany(Permisos::class, 'tipo_permiso_id');
    }
}

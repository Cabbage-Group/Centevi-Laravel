<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProveedorMaterial extends Model
{
    use HasFactory;

    protected $table = 'proveedor_de_material';

    protected $fillable = ['nombre'];

    public $timestamps = true;
}

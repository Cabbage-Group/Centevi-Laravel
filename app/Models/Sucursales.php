<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sucursales extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'sucursales';

    // Clave primaria de la tabla
    protected $primaryKey = 'id_sucursal';


    // Atributos que son asignables en masa
    protected $fillable = [
        'nombre',
        'ubicacion',
        'fecha_creacion',
    ];

    // Indicar si los timestamps están presentes en la tabla
    public $timestamps = false;

    // Atributos que deben ser convertidos a tipos nativos
    protected $casts = [
        'fecha_creacion' => 'datetime',
    ];
}

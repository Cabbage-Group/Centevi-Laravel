<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentosPacientes extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'documentos_pacientes';

    // Clave primaria de la tabla
    protected $primaryKey = 'id_documento';

    // Atributos que son asignables en masa
    protected $fillable = [
        'url',
        'nombre',
        'id_paciente',
        'fecha'
    ];

    // Atributos que deben ser convertidos a tipos nativos
    protected $casts = [
        'fecha' => 'date',
    ];
}

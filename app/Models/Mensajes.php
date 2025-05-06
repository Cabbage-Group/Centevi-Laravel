<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mensajes extends Model
{
    use HasFactory;

    protected $table = 'mensajes'; // Nombre de la tabla en la BD

    protected $fillable = [
        'conversacionId',
        'usuarioId',
        'contenido',
        'leido',
        'creadoEn'
    ];

    public $timestamps = false; // Evita `created_at` y `updated_at` automáticos

    protected $casts = [
        'leido' => 'boolean',
        'creadoEn' => 'datetime'
    ];

    // Relación con Conversación
    public function conversacion()
    {
        return $this->belongsTo(Conversaciones::class, 'conversacionId', 'id');
    }

    // Relación con Usuario
    public function usuario()
    {
        return $this->belongsTo(Usuarios::class, 'usuarioId', 'id_usuario');
    }
}

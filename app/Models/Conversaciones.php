<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversaciones extends Model
{
    use HasFactory;

    protected $table = 'conversaciones'; // Nombre de la tabla en la BD

    protected $fillable = [
        'usuario1Id',
        'usuario2Id',
        'creadoEn',
        'lastMessage',
        'last_time',
        'unread',
        'calendar',
        'lastTime',
        'lastTimeCalendar'
    ];

    public $timestamps = false; // Evita `created_at` y `updated_at` automáticos

    protected $casts = [
        'creadoEn' => 'datetime',
        'lastTimeCalendar' => 'datetime'
    ];

    // Relación con Usuario (usuario1)
    public function usuario1()
    {
        return $this->belongsTo(Usuarios::class, 'usuario1Id', 'id_usuario');
    }

    // Relación con Usuario (usuario2)
    public function usuario2()
    {
        return $this->belongsTo(Usuarios::class, 'usuario2Id', 'id_usuario');
    }

    // Relación con Mensajes
    public function mensajes()
    {
        return $this->hasMany(Mensajes::class, 'conversacionId', 'id');
    }
}

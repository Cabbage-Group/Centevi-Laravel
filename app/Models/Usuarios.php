<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuarios extends Model
{
    use HasFactory, Notifiable;

    // Nombre de la tabla
    protected $table = 'usuarios';

    // Clave primaria de la tabla
    protected $primaryKey = 'id_usuario';
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'usuario',
        'nombre',
        'password',
        'perfil',
        'sucursal',
        'foto',
        'estado',
        'ultimo_login',
        'editado',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'ultimo_login' => 'datetime',
        'editado' => 'date',
    ];

}

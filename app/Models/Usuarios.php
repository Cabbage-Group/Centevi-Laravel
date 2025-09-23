<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuarios extends Model
{
  use HasApiTokens, HasFactory, Notifiable;

  // Nombre de la tabla
  protected $table = 'usuarios';

  // Clave primaria de la tabla
  protected $primaryKey = 'id_usuario';

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  public $timestamps = false;
  protected $fillable = [
    'usuario',
    'nombre',
    'password',
    'perfil',
    'sucursal',
    'foto',
    'estado',
    'tipo_usuario_id',
    'ultimo_login',
    'editado',
    'token'
  ];

  public function tipoUsuario()
  {
    return $this->belongsTo(TiposUsuario::class);
  }

  public function contactosOrdenes()
  {
    return $this->hasMany(ContactoOrden::class, 'usuario_id');
  }

  public function mensajes()
  {
    return $this->hasMany(Mensajes::class, 'usuario_id', 'id_usuario');
  }

  public function conversacionesIniciadas()
  {
    return $this->hasMany(Conversaciones::class, 'usuario1Id', 'id_usuario');
  }

  public function conversacionesRecibidas()
  {
    return $this->hasMany(Conversaciones::class, 'usuario2Id', 'id_usuario');
  }

  public function timelines()
  {
    return $this->hasMany(QuoteTimeline::class, 'usuario_id', 'id_usuario');
  }

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
    'estado' => 'integer'
  ];
}

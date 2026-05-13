<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

 class CorrecionesOrdenes extends Model
{
  use HasFactory;

  // Nombre de la tabla
  protected $table = 'correciones_ordenes';

  protected $fillable = [
    'id',
    'ordenes_id',
    'elaborado_por',
    'esfera_od',
    'esfera_oi',
    'cilindro_od',
    'cilindro_oi',
    'eje_od',
    'eje_oi',
    'add_od',
    'add_oi',
    'prisma_od',
    'prisma_oi',
    'distancia_od',
    'distancia_oi',
    'altura_od',
    'altura_oi',
    'tipo_cristal_od',
    'tipo_cristal_oi',
    'material_od',
    'material_oi',
    'tratamientos_od',
    'tratamientos_oi',
    'aro_centevi',
    'aro_propio',
    'codigo',
    'color',
    'marca',
    'marca_oi',
    'tipo_aro',
    'doctor',
    'observaciones',
    'l_uno',
    'l_dos',
    'l_tres',
    'l_cuatro',
    'l_cinco',
    'pagado',
    'id_pedido',
    'observacion_pedido'
  ];

  // Atributos que deben ser convertidos a tipos nativos
  protected $casts = [
    'elaborado_por' => 'integer',
    'ordenes_id' => 'integer',
    'id_pedido'     => 'integer',
  ];

  public function orden()
  {
    return $this->belongsTo(Ordenes::class, 'ordenes_id', 'id_orden');
  }


  public function faseCorreccionOrden()
  {
    return $this->hasMany(FasesCorreccionesOrdenes::class, 'correccion_ordenes_id', 'id');
  }

  public function usuario()
  {
    return $this->belongsTo(Usuarios::class, 'elaborado_por', 'id_usuario');
  }

  public function pedido()
  {
    return $this->belongsTo(Pedido::class, 'id_pedido', 'id_pedido');
  }

  public function mermas()
  {
    return $this->hasMany(Mermas::class, 'correccion_id', 'id');
  }

  public function observacionesCorreccionesOrden()
  {
    return $this->hasMany(CorreccionesObservacionOrdenes::class, 'correccion_ordenes_id', 'id')
      ->orderBy('created_at', 'asc');
  }
}

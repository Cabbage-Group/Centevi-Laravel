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
    'tipo_aro',
    'doctor',
    'observaciones',
    'l_uno',
    'l_dos',
    'l_tres',
    'l_cuatro',
    'l_cinco',
    'pagado',
  ];

  // Atributos que deben ser convertidos a tipos nativos
  protected $casts = [
    'elaborado_por' => 'integer',
  ];

  public function orden()
    {
        return $this->belongsTo(Ordenes::class, 'ordenes_id', 'id_orden');
    }


}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ordenes extends Model
{
  use HasFactory;

  // Nombre de la tabla
  protected $table = 'ordenes';

  // Clave primaria de la tabla
  protected $primaryKey = 'id_orden';

  // Atributos que son asignables en masa
  protected $fillable = [
    'nro_orden_id',
    'codigo_cristal',
    'nro_cotizacion',
    'nro_orden',
    'id_paciente',
    'id_sucursal',
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
    'tipo_corredor',
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
    'lente_contacto',
    'correccion',
    'cancelada',
    'codigo_cristal'
  ];

  // Atributos que deben ser convertidos a tipos nativos
  protected $casts = [
    'nro_orden' => 'integer',
    'ordenes_id' => 'integer',
    'pagado' => 'integer',
    'id_paciente' => 'integer',
    'id_sucursal' => 'integer',
    'elaborado_por' => 'integer',
    'lente_contacto' => 'integer',
    'correccion' => 'integer',
    'cancelada' => 'integer',
  ];

  public function paciente()
  {
    return $this->belongsTo(Pacientes::class, 'id_paciente', 'id_paciente');
  }

  public function sucursal()
  {
    return $this->belongsTo(Sucursales::class, 'id_sucursal', 'id_sucursal');
  }

  public function contactosOrdenes()
  {
    return $this->hasMany(ContactoOrden::class);
  }

  public function correciones()
  {
    return $this->hasMany(CorrecionesOrdenes::class, 'ordenes_id', 'id_orden');
  }

  public function nroOrden()
  {
    return $this->hasOne(NroOrden::class, 'nro_orden_id', 'id');
  }

  public function fasesOrdenes()
  {
    return $this->hasMany(FasesOrdenes::class, 'ordenes_id', 'id_orden');
  }

}

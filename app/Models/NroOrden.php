<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NroOrden extends Model
{
  use HasFactory;

  protected $table = 'nro_ordenes';

  public function ordenes()
{
    return $this->hasOne(Ordenes::class, 'nro_orden_id', 'id');
}


}

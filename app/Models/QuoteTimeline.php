<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


// nnombre español: seguimiento cotizacion
class QuoteTimeline extends Model
{

  protected $table = 'quotes_timelines';

  protected $fillable = [
    'quote_id',
    'usuario_id',
    'context_title',
    'details',
    'communication_channel',
    'communication_info',
    'occurred_at',
  ];

  public function quote()
  {
    return $this->belongsTo(Quote::class, 'quote_id', 'id');
  }
  public function usuario()
  {
    return $this->belongsTo(Usuarios::class, 'usuario_id', 'id_usuario');
  }

  // Castear fechas a Carbon
  protected $casts = [
    'occurred_at'   => 'datetime',
    'created_at'   => 'datetime',
    'updated_at'   => 'datetime',
  ];
}

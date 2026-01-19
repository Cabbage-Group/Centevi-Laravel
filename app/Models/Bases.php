<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bases extends Model
{
    use HasFactory;

    protected $table = 'bases';
    protected $fillable = [
        'codigo',
        'descripcion'
    ];
}

<?php

namespace App\Services;

use RuntimeException;

class SimulacionFusion extends RuntimeException
{
  public function __construct(public array $resultado)
  {
    parent::__construct('Simulación de fusión (revertida).');
  }
}

<?php

namespace App\Observers;
use Illuminate\Database\Eloquent\Model;

class AuditObserver
{
    public function created(Model $model)
    {
        $this->addTable($model);
    }

    public function updated(Model $model)
    {
        $this->addTable($model);
    }

    public function deleted(Model $model)
    {
        $this->addTable($model);
    }

    private function addTable(Model $model)
    {
        if (!app()->bound('audit.context')) {
            return;
        }

        $context = app('audit.context');
        $table = $model->getTable();

        // Evitamos duplicados
        if (!in_array($table, $context['tablas'])) {
            $context['tablas'][] = $table;
        }

        // Actualizamos la instancia del contexto
        app()->instance('audit.context', $context);
    }
}

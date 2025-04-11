<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use App\Services\InterfuerzaCreateService;

class InterfuerzaClientCreator
{
    protected $createService;

    public function __construct(InterfuerzaCreateService $createService)
    {
        $this->createService = $createService;
    }

    public function crearCliente($paciente, $usuario)
    {
        $payload = [
            'class' => 'PUT',
            'action' => 'customers',
            'data' => [
                "Tipo" => "CLIENTE",
                "RUC" => $paciente->nro_cedula ?? '',
                "DV" => "",
                "Empresa" => $paciente->nombres . ' ' . $paciente->apellidos,
                "Email" => $paciente->email ?? '',
                "Status" => "ACTIVE",
                "Telefono_1" => $paciente->telefono ?? '',
                "Telefono_2" => "",
                "Cellular" => $paciente->celular ?? '',
                "Direccion" => $paciente->direccion ?? '',
                "Ciudad" => "PANAMA",
                "Estado" => "PANAMA",
                "Pais" => "PANAMA",
                "Empleados" => "1",
                "Industria" => "",
                "Credit_Term" => "",
                "Due_Days" => "30",
                "Credit_Amount_Limit" => "1000.00",
                "Vendedor" => $usuario ?? "",
                "BirthDate" => $paciente->fecha_nacimiento ?? "",
                "Taxable" => true,
                "Tipo_Contribuyente" => "1",
                "Clase" => "Juridica",
                "Name_First" => $paciente->nombres ?? '',
                "Name_Second" => "",
                "LastName_First" => $paciente->apellidos ?? '',
                "LastName_Second" => ""
            ]
        ];

        try {
            return $this->createService->request($payload);
        } catch (\Exception $e) {
            Log::error('Error creando cliente en Interfuerza', ['error' => $e->getMessage()]);
            return null;
        }
        // return null;
    }
}

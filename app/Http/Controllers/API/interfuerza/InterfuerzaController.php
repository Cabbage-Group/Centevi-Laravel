<?php

namespace App\Http\Controllers\API\interfuerza;

use App\Http\Controllers\Controller;
use App\Models\Pacientes;
use App\Services\InterfuerzaCreateService;
use App\Services\InterfuerzaService;
use Illuminate\Http\Request;

class InterfuerzaController extends Controller
{
    protected $interfuerzaService;
    protected $interfuerzaCreateService;

    public function __construct(InterfuerzaService $interfuerzaService, InterfuerzaCreateService $interfuerzaCreateService)
    {
        $this->interfuerzaService = $interfuerzaService;
        $this->interfuerzaCreateService = $interfuerzaCreateService;
    }

    public function verificarYActualizar(Request $request)
    {
        $ruc = $request->input('ruc');

        if (!$ruc) {
            return response()->json(['message' => 'RUC no proporcionado'], 400);
        }

        $response = $this->interfuerzaService->request([
            'class' => 'GET',
            'action' => 'customers',
            'page' => '1',
            'filters' => [
                [
                    'field' => 'RUC',
                    'type' => '=',
                    'value' => $ruc,
                ]
            ]
        ]);

        if (!$response->successful()) {
            return response()->json(['message' => 'Error al consultar el sistema externo'], 500);
        }

        $data = $response->json();
        $paciente = Pacientes::where('nro_cedula', $ruc)->first();

        // Si el cliente no existe en sistema externo
        if (empty($data['customers']) || count($data['customers']) === 0) {
            if ($paciente) {
                $payload = [
                    'class' => 'PUT',
                    'action' => 'customers',
                    'data' => [
                        "Tipo" => "CLIENTE",
                        "RUC" => $paciente->nro_cedula,
                        "DV" => "12",
                        "Empresa" => "MI EMPRESA S.A.",
                        "Email" => "usuario@miepresa.com",
                        "Status" => "ACTIVE",
                        "Telefono_1" => "+(507) 202-1234",
                        "Telefono_2" => "",
                        "Cellular" => "",
                        "Direccion" => "Tumba muerto, Edificio Mi Empresa S.A.",
                        "Ciudad" => "PANAMA",
                        "Estado" => "PANAMA",
                        "Pais" => "PANAMA",
                        "Empleados" => "1",
                        "Industria" => "Retail",
                        "Credit_Term" => "CREDIT",
                        "Due_Days" => "30",
                        "Credit_Amount_Limit" => "1000.00",
                        "Vendedor" => "adm@elconix.com",
                        "BirthDate" => "1980-02-21",
                        "Taxable" => true,
                        "Tipo_Contribuyente" => "1",
                        "Clase" => "Juridica",
                        "Name_First" => $paciente->nombres,
                        "Name_Second" => "",
                        "LastName_First" => "",
                        "LastName_Second" => ""
                    ]
                ];

                $this->interfuerzaCreateService->request($payload);

                $paciente->interfuerza = false;
                $paciente->save();

                return response()->json([
                    'message' => 'Cliente no encontrado. Se creó uno nuevo en el sistema externo',
                    'paciente' => $paciente
                ], 201);
            }

            return response()->json(['message' => 'Paciente no encontrado en tu sistema'], 404);
        }

        if (!$paciente) {
            return response()->json(['message' => 'Paciente no encontrado en tu sistema'], 404);
        }

        $paciente->interfuerza = true;
        $paciente->save();

        return response()->json([
            'message' => 'Paciente actualizado con éxito',
            'paciente' => $paciente
        ]);
    }
}

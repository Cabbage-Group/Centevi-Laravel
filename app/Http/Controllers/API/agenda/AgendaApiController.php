<?php

namespace App\Http\Controllers\API\agenda;

use App\Http\Controllers\Controller;
use App\Models\BajaVision;
use App\Models\ConsultaGenerica;
use App\Models\OptometriaNeonatos;
use App\Models\OptometriaPediatrica;
use App\Models\OrtopticaAdultos;
use App\Models\ProximasCitas;
use App\Models\RefraccionGeneral;
use App\Models\Sucursales;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AgendaApiController extends Controller
{
    // public function getEvents()
    // {
    //     // Obtener todas las consultas con una fecha programada
    //     $consultas = BajaVision::whereNotNull('fecha_proxima_consulta')->get();

    //     // Formatear los eventos para FullCalendar
    //     $events = $consultas->map(function ($conszulta) {
    //         return [
    //             'id' => $consulta->id_consulta,
    //             'title' => $consulta->doctor,
    //             'start' => $consulta->fecha_proxima_consulta->format('Y-m-d'),
    //             'badge' => $this->getSucursalNombre($consulta->sucursal), 
    //         ];
    //     });

    //     return response()->json($events);
    // }

    // private function getSucursalNombre($id)
    // {
    //     $sucursal = Sucursales::find($id);
    //     return $sucursal ? $sucursal->nombre : 'Desconocido';
    // }

    public function index(Request $request)
    {
        $month = $request->input('month', Carbon::now()->month);
        $year = $request->input('year', Carbon::now()->year);

        $query = ProximasCitas::with(['paciente:id_paciente,nombres,nro_cedula', 'sucursal:id_sucursal,nombre'])
            ->whereMonth('fecha_hora', $month)
            ->whereYear('fecha_hora', $year)
            ->get();

        return response()->json([
            "data" => $query
        ]);
    }


    public function generarDataProximasCitas()
    {
        $consultas = BajaVision::whereNotNull('fecha_proxima_consulta')->get();

        foreach ($consultas as $consulta) {
            ProximasCitas::updateOrCreate(
                [
                    'origen_id' => $consulta->id_consulta,
                    'origen_tabla' => 'baja_vision'
                ],
                [
                    'paciente_id' => $consulta->paciente,
                    'doctor_id' => $consulta->doctor,
                    'sucursal_id' => $consulta->sucursal,
                    'fecha_hora' => $consulta->fecha_proxima_consulta,
                    'comentarios' => ' ',
                    'tipo' => 'Consulta',
                ]
            );
        }

        $consultasGenericas = ConsultaGenerica::whereNotNull('fecha_proxima_consulta')->get();

        foreach ($consultasGenericas as $consulta) {
            ProximasCitas::updateOrCreate(
                [
                    'origen_id' => $consulta->id_consulta,
                    'origen_tabla' => 'consulta_generica'
                ],
                [
                    'paciente_id' => $consulta->paciente,
                    'doctor_id' => $consulta->doctor,
                    'sucursal_id' => $consulta->sucursal,
                    'fecha_hora' => $consulta->fecha_proxima_consulta,
                    'comentarios' => ' ',
                    'tipo' => 'Consulta',
                ]
            );
        }

        $consultasNeonatos = OptometriaNeonatos::whereNotNull('fecha_proxima_consulta')->get();

        foreach ($consultasNeonatos as $consulta) {
            ProximasCitas::updateOrCreate(
                [
                    'origen_id' => $consulta->id_consulta,
                    'origen_tabla' => 'optometria_neonatos'
                ],
                [
                    'paciente_id' => $consulta->paciente,
                    'doctor_id' => $consulta->doctor,
                    'sucursal_id' => $consulta->sucursal,
                    'fecha_hora' => $consulta->fecha_proxima_consulta,
                    'comentarios' => ' ',
                    'tipo' => 'Consulta',
                ]
            );
        }

        $consultasOptometriaPediatrica = OptometriaPediatrica::whereNotNull('fecha_proxima_consulta')->get();

        foreach ($consultasOptometriaPediatrica as $consulta) {
            ProximasCitas::updateOrCreate(
                [
                    'origen_id' => $consulta->id_consulta,
                    'origen_tabla' => 'optometria_pediatrica'
                ],
                [
                    'paciente_id' => $consulta->paciente,
                    'doctor_id' => $consulta->doctor,
                    'sucursal_id' => $consulta->sucursal,
                    'fecha_hora' => $consulta->fecha_proxima_consulta,
                    'comentarios' => ' ',
                    'tipo' => 'Consulta',
                ]
            );
        }


        $consultasOrtopticaAdultos = OrtopticaAdultos::whereNotNull('fecha_proxima_consulta')->get();
        foreach ($consultasOrtopticaAdultos as $consulta) {
            ProximasCitas::updateOrCreate(
                [
                    'origen_id' => $consulta->id_consulta,
                    'origen_tabla' => 'ortoptica_adultos',
                ],
                [
                    'paciente_id' => $consulta->paciente,
                    'doctor_id' => $consulta->doctor,
                    'sucursal_id' => $consulta->sucursal,
                    'fecha_hora' => $consulta->fecha_proxima_consulta,
                    'comentarios' => ' ',
                    'tipo' => 'Consulta',
                ]
            );
        }

        $consultasRefraccionGeneral = RefraccionGeneral::whereNotNull('fecha_proxima_consulta')->get();
        foreach ($consultasRefraccionGeneral as $consulta) {
            ProximasCitas::updateOrCreate(
                [
                    'origen_id' => $consulta->id_consulta,
                    'origen_tabla' => 'refraccion_general',
                ],
                [
                    'paciente_id' => $consulta->paciente,
                    'doctor_id' => $consulta->doctor,
                    'sucursal_id' => $consulta->sucursal,
                    'fecha_hora' => $consulta->fecha_proxima_consulta,
                    'comentarios' => ' ',
                    'tipo' => 'Consulta',
                ]
            );
        }



        return response()->json(['message' => 'Proximas citas actualizadas correctamente']);
    }
}

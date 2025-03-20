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
use Illuminate\Support\Facades\DB;

class AgendaApiController extends Controller
{

    public function verEventosAgenda(Request $request)
    {
        $month = $request->input('month', Carbon::now()->month);
        $year = $request->input('year', Carbon::now()->year);
        $sucursales = $request->input('sucursales', []);

        $query = ProximasCitas::with(['paciente:id_paciente,nombres,nro_cedula', 'sucursal:id_sucursal,nombre'])
            ->whereMonth('fecha_hora', $month)
            ->whereYear('fecha_hora', $year);

        if (!empty($sucursales)) {
            if (in_array('otros', $sucursales)) {
                $query->whereNotIn('sucursal_id', [3, 4, 7]);
            } else {
                $query->whereIn('sucursal_id', $sucursales);
            }
        }

        return response()->json([
            "data" => $query->get()
        ]);
    }


    public function generarDataProximasCitas()
    {

        DB::table('consultagenerica')->update([
            'fecha_proxima_consulta' => DB::raw("CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00')")
        ]);
        
        DB::table('baja_vision')->update([
            'fecha_proxima_consulta' => DB::raw("CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00')")
        ]);
        
        DB::table('optometria_neonatos')->update([
            'fecha_proxima_consulta' => DB::raw("CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00')")
        ]);
        
        DB::table('optometria_pediatrica')->update([
            'fecha_proxima_consulta' => DB::raw("CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00')")
        ]);
        
        DB::table('ortoptica_adultos')->update([
            'fecha_proxima_consulta' => DB::raw("CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00')")
        ]);
        
        DB::table('refracciongeneral')->update([
            'fecha_proxima_consulta' => DB::raw("CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00')")
        ]);

        // UPDATE consultagenerica
        // SET fecha_proxima_consulta = CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00');

        // UPDATE baja_vision
        // SET fecha_proxima_consulta = CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00');

        // UPDATE optometria_neonatos
        // SET fecha_proxima_consulta = CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00');

        // UPDATE optometria_pediatrica
        // SET fecha_proxima_consulta = CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00');

        // UPDATE ortoptica_adultos
        // SET fecha_proxima_consulta = CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00');

        // UPDATE refracciongeneral
        // SET fecha_proxima_consulta = CONCAT(DATE(fecha_proxima_consulta), ' 12:00:00');

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

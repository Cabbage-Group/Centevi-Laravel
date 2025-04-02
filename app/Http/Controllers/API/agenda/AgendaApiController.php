<?php

namespace App\Http\Controllers\API\agenda;

use App\Http\Controllers\Controller;
use App\Models\BajaVision;
use App\Models\Citas;
use App\Models\ConsultaGenerica;
use App\Models\OptometriaNeonatos;
use App\Models\OptometriaPediatrica;
use App\Models\OrtopticaAdultos;
use App\Models\RefraccionGeneral;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;


class AgendaApiController extends Controller
{

    public function verEventosAgenda(Request $request)
    {
        $months = $request->input('months', [Carbon::now()->month]);
        $years = $request->input('years', [Carbon::now()->year]);
        $sucursales = $request->input('sucursales', []);
        $exProximaCita = $request->input('ex_proxima_cita', null);
        $hasCitasId = $request->input('has_citas_id', null);
        $citasIdNull = $request->input('citas_id_null', null);
        $tipo = $request->input('tipo', null);

        // Convertir a array si no lo es
        if (!is_array($months)) {
            $months = explode(',', $months);
        }
        if (!is_array($years)) {
            $years = explode(',', $years);
        }

        $query = Citas::with(['paciente:id_paciente,nombres,nro_cedula,telefono,celular', 'sucursal:id_sucursal,nombre'])
            ->whereIn(DB::raw('MONTH(fecha_hora)'), $months)
            ->whereIn(DB::raw('YEAR(fecha_hora)'), $years);

        if (!empty($sucursales)) {
            if (in_array('otros', $sucursales)) {
                $query->whereNotIn('sucursal_id', [3, 4, 7]);
            } else {
                $query->whereIn('sucursal_id', $sucursales);
            }
        }

        if (!is_null($exProximaCita)) {
            $query->where('ex_proxima_cita', filter_var($exProximaCita, FILTER_VALIDATE_BOOLEAN));
        }

        if (!is_null($hasCitasId) && filter_var($hasCitasId, FILTER_VALIDATE_BOOLEAN)) {
            $query->whereNotNull('citas_id');
        }

        if (!is_null($citasIdNull) && filter_var($citasIdNull, FILTER_VALIDATE_BOOLEAN)) {
            $query->whereNull('citas_id');
        }

        if (!is_null($tipo) && in_array($tipo, ['consulta', 'terapia'])) {
            $query->where('tipo', $tipo);
        }

        return response()->json([
            "data" => $query->get()
        ]);
    }


    public function agendarCita(Request $request)
    {
        $request->validate([
            'origen_id' => 'required|integer',
            'origen_tabla' => 'required|string',
            'fecha_hora' => 'required|date',
            'tipo' => 'required|in:consulta,terapia',
            'paciente_id' => 'required|integer',
            'doctor' => 'nullable|string',
            'sucursal_id' => 'nullable|integer',
            'comentarios' => 'nullable|string',
            'agendado_por' => 'nullable|string',
            'cita_existente_id' => 'nullable|integer|exists:citas,id', // ID de la cita a actualizar
        ]);

        $nuevaCita = Citas::create([
            'origen_id' => $request->origen_id,
            'origen_tabla' => $request->origen_tabla,
            'fecha_hora' => $request->fecha_hora,
            'tipo' => $request->tipo,
            'paciente_id' => $request->paciente_id,
            'doctor' => $request->doctor,
            'sucursal_id' => $request->sucursal_id,
            'agendado_por' => $request->agendado_por,
            'ex_proxima_cita' => false,
            'comentarios' => $request->comentarios,

        ]);

        if ($request->cita_existente_id) {
            $citaExistente = Citas::where('id', $request->cita_existente_id)->whereNull('citas_id')->first();

            if ($citaExistente) {
                $citaExistente->update(['citas_id' => $nuevaCita->id]);
            }
        }

        return response()->json([
            'message' => 'Cita creada exitosamente',
            'nueva_cita' => $nuevaCita,
            'cita_existente_id' => $request->cita_existente_id
        ], 201);
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
            Citas::updateOrCreate(
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
                    'tipo' => 'proxima cita',
                    'ex_proxima_cita' => true
                ]
            );
        }

        $consultasGenericas = ConsultaGenerica::whereNotNull('fecha_proxima_consulta')->get();

        foreach ($consultasGenericas as $consulta) {
            Citas::updateOrCreate(
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
                    'tipo' => 'proxima cita',
                    'ex_proxima_cita' => true
                ]
            );
        }

        $consultasNeonatos = OptometriaNeonatos::whereNotNull('fecha_proxima_consulta')->get();

        foreach ($consultasNeonatos as $consulta) {
            Citas::updateOrCreate(
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
                    'tipo' => 'proxima cita',
                    'ex_proxima_cita' => true
                ]
            );
        }

        $consultasOptometriaPediatrica = OptometriaPediatrica::whereNotNull('fecha_proxima_consulta')->get();

        foreach ($consultasOptometriaPediatrica as $consulta) {
            Citas::updateOrCreate(
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
                    'tipo' => 'proxima cita',
                    'ex_proxima_cita' => true
                ]
            );
        }


        $consultasOrtopticaAdultos = OrtopticaAdultos::whereNotNull('fecha_proxima_consulta')->get();
        foreach ($consultasOrtopticaAdultos as $consulta) {
            Citas::updateOrCreate(
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
                    'tipo' => 'proxima cita',
                    'ex_proxima_cita' => true
                ]
            );
        }

        $consultasRefraccionGeneral = RefraccionGeneral::whereNotNull('fecha_proxima_consulta')->get();
        foreach ($consultasRefraccionGeneral as $consulta) {
            Citas::updateOrCreate(
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
                    'tipo' => 'proxima cita',
                    'ex_proxima_cita' => true
                ]
            );
        }

        return response()->json(['message' => 'Proximas citas actualizadas correctamente']);
    }
}

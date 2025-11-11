<?php

namespace App\Http\Controllers\API\reportes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReporteDiagnosticosController extends Controller
{
  public function obtenerReporteDiagnosticos(Request $request)
  {
    // Parámetros de filtro y paginación
    $desde = $request->query('desde'); // YYYY-MM-DD
    $hasta = $request->query('hasta'); // YYYY-MM-DD
    $page = (int) $request->query('page', 1);
    $perPage = (int) $request->query('limit', 10);

    // Filtro de fecha
    $fechaFiltro = '';
    if ($desde && $hasta) {
      $fechaFiltro = "WHERE fecha_atencion BETWEEN '$desde' AND '$hasta'";
    } elseif ($desde) {
      $fechaFiltro = "WHERE fecha_atencion >= '$desde'";
    } elseif ($hasta) {
      $fechaFiltro = "WHERE fecha_atencion <= '$hasta'";
    }

    $query = "
            SELECT * FROM (
                SELECT
                    hc.doctor,
                    s.nombre AS sucursal_nombre,
                    CONCAT(p.nombres, ' ', p.apellidos) AS paciente_nombre,
                    'Historia Clinica' as consulta,
                    COUNT(dhc.diagnostico_id) as diagnosticos,
                    hc.fecha_atencion as fecha
                FROM consultagenerica hc
                LEFT JOIN diagnosticos_historias_clinicas dhc
                    ON dhc.historia_clinica_id = hc.id_consulta
                LEFT JOIN sucursales s ON s.id_sucursal = hc.sucursal
                LEFT JOIN pacientes p ON p.id_paciente = hc.paciente
                $fechaFiltro
                GROUP BY hc.id_consulta, hc.doctor, s.nombre, p.nombres, p.apellidos, hc.fecha_atencion

                UNION ALL

                SELECT
                    rg.doctor,
                    s.nombre AS sucursal_nombre,
                    CONCAT(p.nombres, ' ', p.apellidos) AS paciente_nombre,
                    'Optometria General' as consulta,
                    COUNT(dog.diagnostico_id) as diagnosticos,
                    rg.fecha_atencion as fecha
                FROM refracciongeneral rg
                LEFT JOIN diagnosticos_optometria_general dog
                    ON dog.optometria_general_id = rg.id_consulta
                LEFT JOIN sucursales s ON s.id_sucursal = rg.sucursal
                LEFT JOIN pacientes p ON p.id_paciente = rg.paciente
                $fechaFiltro
                GROUP BY rg.id_consulta, rg.doctor, s.nombre, p.nombres, p.apellidos, rg.fecha_atencion

                UNION ALL

                SELECT
                    ont.doctor,
                    s.nombre AS sucursal_nombre,
                    CONCAT(p.nombres, ' ', p.apellidos) AS paciente_nombre,
                    'Optometria Neonatos' as consulta,
                    COUNT(don.diagnostico_id) as diagnosticos,
                    ont.fecha_atencion as fecha
                FROM optometria_neonatos ont
                LEFT JOIN diagnosticos_optometria_neonatos don
                    ON don.optometria_neonatos_id = ont.id_consulta
                LEFT JOIN sucursales s ON s.id_sucursal = ont.sucursal
                LEFT JOIN pacientes p ON p.id_paciente = ont.paciente
                $fechaFiltro
                GROUP BY ont.id_consulta, ont.doctor, s.nombre, p.nombres, p.apellidos, ont.fecha_atencion

                UNION ALL

                SELECT
                    op.doctor,
                    s.nombre AS sucursal_nombre,
                    CONCAT(p.nombres, ' ', p.apellidos) AS paciente_nombre,
                    'Optometria Pediatrica' as consulta,
                    COUNT(dop.diagnostico_id) as diagnosticos,
                    op.fecha_atencion as fecha
                FROM optometria_pediatrica op
                LEFT JOIN diagnosticos_optometria_pediatrica dop
                    ON dop.optometria_pediatrica_id = op.id_consulta
                LEFT JOIN sucursales s ON s.id_sucursal = op.sucursal
                LEFT JOIN pacientes p ON p.id_paciente = op.paciente
                $fechaFiltro
                GROUP BY op.id_consulta, op.doctor, s.nombre, p.nombres, p.apellidos, op.fecha_atencion

                UNION ALL

                SELECT
                    oa.doctor,
                    s.nombre AS sucursal_nombre,
                    CONCAT(p.nombres, ' ', p.apellidos) AS paciente_nombre,
                    'Ortoptica Adultos' as consulta,
                    COUNT(doa.diagnostico_id) as diagnosticos,
                    oa.fecha_atencion as fecha
                FROM ortoptica_adultos oa
                LEFT JOIN diagnosticos_ortoptica_adultos doa
                    ON doa.ortoptica_adulto_id = oa.id_consulta
                LEFT JOIN sucursales s ON s.id_sucursal = oa.sucursal
                LEFT JOIN pacientes p ON p.id_paciente = oa.paciente
                $fechaFiltro
                GROUP BY oa.id_consulta, oa.doctor, s.nombre, p.nombres, p.apellidos, oa.fecha_atencion
            ) as union_diagnosticos
            ORDER BY fecha DESC
        ";

    $allResults = DB::select($query);

    // Paginación manual
    $total = count($allResults);
    $itemsForCurrentPage = array_slice($allResults, ($page - 1) * $perPage, $perPage);

    $paginator = new LengthAwarePaginator(
      $itemsForCurrentPage,
      $total,
      $perPage,
      $page,
      ['path' => $request->url(), 'query' => $request->query()]
    );

    return response()->json([
      'data' => $itemsForCurrentPage,
      'meta' => [
        'current_page' => $paginator->currentPage(),
        'per_page' => $paginator->perPage(),
        'total' => $paginator->total(),
        'last_page' => $paginator->lastPage(),
      ],
    ]);
  }

  public function exportarExcelDiagnosticos(Request $request)
  {
    $desde = $request->query('desde'); // YYYY-MM-DD
    $hasta = $request->query('hasta'); // YYYY-MM-DD

    // Filtro dinámico
    $fechaFiltro = '';
    if ($desde && $hasta) {
      $fechaFiltro = "WHERE fecha_atencion BETWEEN '$desde' AND '$hasta'";
    } elseif ($desde) {
      $fechaFiltro = "WHERE fecha_atencion >= '$desde'";
    } elseif ($hasta) {
      $fechaFiltro = "WHERE fecha_atencion <= '$hasta'";
    }

    $query = "
        SELECT
            hc.doctor,
            s.nombre AS sucursal_nombre,
            CONCAT(p.nombres, ' ', p.apellidos) AS paciente_nombre,
            'Historia Clinica' AS consulta,
            d.codigo AS codigo,
            d.diagnostico AS diagnostico_nombre,
            hc.fecha_atencion AS fecha
        FROM consultagenerica hc
        LEFT JOIN diagnosticos_historias_clinicas dhc ON dhc.historia_clinica_id = hc.id_consulta
        LEFT JOIN diagnosticos d ON d.id = dhc.diagnostico_id
        LEFT JOIN sucursales s ON s.id_sucursal = hc.sucursal
        LEFT JOIN pacientes p ON p.id_paciente = hc.paciente
        $fechaFiltro

        UNION ALL

        SELECT
            rg.doctor,
            s.nombre AS sucursal_nombre,
            CONCAT(p.nombres, ' ', p.apellidos) AS paciente_nombre,
            'Optometria General' AS consulta,
            d.codigo AS codigo,
            d.diagnostico AS diagnostico_nombre,
            rg.fecha_atencion AS fecha
        FROM refracciongeneral rg
        LEFT JOIN diagnosticos_optometria_general dog ON dog.optometria_general_id = rg.id_consulta
        LEFT JOIN diagnosticos d ON d.id = dog.diagnostico_id
        LEFT JOIN sucursales s ON s.id_sucursal = rg.sucursal
        LEFT JOIN pacientes p ON p.id_paciente = rg.paciente
        $fechaFiltro

        UNION ALL

        SELECT
            ont.doctor,
            s.nombre AS sucursal_nombre,
            CONCAT(p.nombres, ' ', p.apellidos) AS paciente_nombre,
            'Optometria Neonatos' AS consulta,
            d.codigo AS codigo,
            d.diagnostico AS diagnostico_nombre,
            ont.fecha_atencion AS fecha
        FROM optometria_neonatos ont
        LEFT JOIN diagnosticos_optometria_neonatos don ON don.optometria_neonatos_id = ont.id_consulta
        LEFT JOIN diagnosticos d ON d.id = don.diagnostico_id
        LEFT JOIN sucursales s ON s.id_sucursal = ont.sucursal
        LEFT JOIN pacientes p ON p.id_paciente = ont.paciente
        $fechaFiltro

        UNION ALL

        SELECT
            op.doctor,
            s.nombre AS sucursal_nombre,
            CONCAT(p.nombres, ' ', p.apellidos) AS paciente_nombre,
            'Optometria Pediatrica' AS consulta,
            d.codigo AS codigo,
            d.diagnostico AS diagnostico_nombre,
            op.fecha_atencion AS fecha
        FROM optometria_pediatrica op
        LEFT JOIN diagnosticos_optometria_pediatrica dop ON dop.optometria_pediatrica_id = op.id_consulta
        LEFT JOIN diagnosticos d ON d.id = dop.diagnostico_id
        LEFT JOIN sucursales s ON s.id_sucursal = op.sucursal
        LEFT JOIN pacientes p ON p.id_paciente = op.paciente
        $fechaFiltro

        UNION ALL

        SELECT
            oa.doctor,
            s.nombre AS sucursal_nombre,
            CONCAT(p.nombres, ' ', p.apellidos) AS paciente_nombre,
            'Ortoptica Adultos' AS consulta,
            d.codigo AS codigo,
            d.diagnostico AS diagnostico_nombre,
            oa.fecha_atencion AS fecha
        FROM ortoptica_adultos oa
        LEFT JOIN diagnosticos_ortoptica_adultos doa ON doa.ortoptica_adulto_id = oa.id_consulta
        LEFT JOIN diagnosticos d ON d.id = doa.diagnostico_id
        LEFT JOIN sucursales s ON s.id_sucursal = oa.sucursal
        LEFT JOIN pacientes p ON p.id_paciente = oa.paciente
        $fechaFiltro
    ";

    $result = DB::select($query);

    // Generar Excel con PhpSpreadsheet
    $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();

    // Cabecera
    $headers = ['Doctor', 'Sucursal', 'Paciente', 'Consulta', 'Código', 'Diagnóstico', 'Fecha'];
    $sheet->fromArray($headers, null, 'A1');

    $headerStyle = [
      'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
      'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['rgb' => '0070C0']],
      'alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER],
    ];
    $sheet->getStyle('A1:G1')->applyFromArray($headerStyle);

    foreach (range('A', 'G') as $col) {
      $sheet->getColumnDimension($col)->setWidth(25);
    }

    // Insertar datos dejando vacíos los repetidos
    $lastDoctor = $lastSucursal = $lastPaciente = $lastConsulta = null;
    $rowNum = 2;
    foreach ($result as $r) {
      $sheet->setCellValue("A$rowNum", $r->doctor === $lastDoctor ? '' : $r->doctor);
      $sheet->setCellValue("B$rowNum", $r->sucursal_nombre === $lastSucursal ? '' : $r->sucursal_nombre);
      $sheet->setCellValue("C$rowNum", $r->paciente_nombre === $lastPaciente ? '' : $r->paciente_nombre);
      $sheet->setCellValue("D$rowNum", $r->consulta === $lastConsulta ? '' : $r->consulta);
      $sheet->setCellValue("E$rowNum", $r->codigo);
      $sheet->setCellValue("F$rowNum", $r->diagnostico_nombre);
      $sheet->setCellValue("G$rowNum", $r->fecha);

      $lastDoctor = $r->doctor;
      $lastSucursal = $r->sucursal_nombre;
      $lastPaciente = $r->paciente_nombre;
      $lastConsulta = $r->consulta;

      $rowNum++;
    }

    $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
    $fileName = 'ReporteDiagnosticos.xlsx';
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header("Content-Disposition: attachment; filename=\"$fileName\"");
    $writer->save('php://output');
    exit;
  }
}

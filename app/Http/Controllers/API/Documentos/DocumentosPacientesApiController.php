<?php

namespace App\Http\Controllers\API\Documentos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DocumentosPacientes;
use Illuminate\Support\Facades\Storage;


class DocumentosPacientesApiController extends Controller
{

  public function uploadDocument(Request $request)
  {
    // $request->validate([
    //   'documento' => 'required|file|mimes:pdf,jpeg,png,jpg',
    //   'id_paciente' => 'required|integer',
    // ]);

    // return response()->json([
    //   'id_paciente' => $request->input('id_paciente'),
    //   ''
    // ]);

    if ($request->hasFile('documento')) {

      $archivo = $request->file('documento');

      // Definir el nombre del archivo
      $nombreArchivo = $request->input('id_paciente') . '_' . $archivo->getClientOriginalName();

      // Mover el archivo a la carpeta 'public/uploads'
      $rutaArchivo = public_path('historia-paciente/uploads');
      $archivo->move($rutaArchivo, $nombreArchivo);

      $documentoPaciente = new DocumentosPacientes([
        'url' => 'uploads/' . $nombreArchivo,
        'nombre' => $nombreArchivo,
        'id_paciente' => $request->input('id_paciente'),
        'fecha' => now(),
      ]);

      if ($documentoPaciente->save()) {
        return response()->json([
          'mensaje' => 'Archivo subido con éxito.',
          'ruta' => $rutaArchivo,
          'response' => true,
          'documento' => $documentoPaciente
        ], 200);
      }
    }

    return response()->json([
      'message' => 'Error al subir el archivo',
      'response' => false
      // 'documento' => $documentoPaciente
    ]);
  }

  public function index($idPaciente)
  {
    // Obtener todos los documentos asociados al paciente
    $documentos = DocumentosPacientes::where('id_paciente', $idPaciente)->get();

    return response()->json($documentos);
  }

  public function destroy($idDocumento)
  {
    $documento = DocumentosPacientes::find($idDocumento);

    // // Eliminar el archivo físico si es necesario
    // if (Storage::exists($documento->url)) {
    //   Storage::delete($documento->url);
    // }

    if ($documento) {
      $documento->delete();
      return response()->json([
        'respuesta' => true,
        'message' => 'Documento eliminado correctamente.',
        'mensaje_dev' => null
      ], 200);
    }

    return response()->json([
      'respuesta' => false,
      'message' => 'No se pudo eliminar',
      'mensaje_dev' => null
    ], 200);
  }
}

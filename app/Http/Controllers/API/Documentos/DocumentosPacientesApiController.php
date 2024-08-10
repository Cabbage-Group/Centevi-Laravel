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
        $request->validate([
            'documento' => 'required|file|mimes:pdf,jpeg,png,jpg',
            'id_paciente' => 'required|integer',
        ]);

        $file = $request->file('documento');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('public/documentos_pacientes', $fileName);

        $documentoPaciente = new DocumentosPacientes([
            'url' => Storage::url($filePath),
            'nombre' => $fileName,
            'id_paciente' => $request->input('id_paciente'),
            'fecha' => now(),
        ]);

        $documentoPaciente->save();

        return response()->json(['message' => 'Documento subido exitosamente', 'documento' => $documentoPaciente]);
    }

    public function index($idPaciente)
    {
        // Obtener todos los documentos asociados al paciente
        $documentos = DocumentosPacientes::where('id_paciente', $idPaciente)->get();

        return response()->json($documentos);
    }

    public function destroy($idDocumento)
    {
        $documento = DocumentosPacientes::findOrFail($idDocumento);

        // Eliminar el archivo físico si es necesario
        if (Storage::exists($documento->url)) {
            Storage::delete($documento->url);
        }

        // Eliminar el registro en la base de datos
        $documento->delete();

        return response()->json(['message' => 'Documento eliminado correctamente.']);
    }
}

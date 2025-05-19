<?php

namespace App\Http\Controllers\API\download;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
class DownloadController extends Controller

{
    public function download($fileId)
    {
        // Definir la ruta del archivo (ajusta esta ruta según tu necesidad)
        $filePath = storage_path("files/{$fileId}");

        // Verificar si el archivo existe
        if (file_exists($filePath)) {
            // Obtener el nombre del archivo
            $fileName = basename($filePath);

            // Retornar la respuesta de descarga con los encabezados adecuados
            return response()->download($filePath, $fileName, [
                'Content-Type' => 'image/jpeg', // Tipo MIME
                'Content-Disposition' => 'attachment; filename="' . $fileName . '"', // Indicar que es una descarga
            ]);
        }

        // Si el archivo no existe, retornar un error 404
        return response()->json(['error' => 'File not found'], 404);
    }

    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf,docx,txt,pptx,xlsx|max:20480', // Aceptar solo ciertos tipos de archivo y con un tamaño máximo de 20MB
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();

            $directory = 'files';

            $path = storage_path('app/public/');
            File::ensureDirectoryExists($path);

            $filePath = $file->storeAs($directory, $fileName, 'public');

            $archivoUrl = url('storage/' . $filePath);

            $tipoArchivo = $file->getMimeType();

            return response()->json([
                'archivoUrl' => $archivoUrl,
                'nombreArchivo' => $fileName,
                'tipoArchivo' => $tipoArchivo,
            ], 200);
        }

        // Si no se recibe archivo, retornar error
        return response()->json(['error' => 'No file uploaded'], 400);
    }
}

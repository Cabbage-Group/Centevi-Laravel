<?php

namespace App\Http\Controllers\API\proveedorMaterial;

use App\Http\Controllers\Controller;
use App\Models\ProveedorMaterial;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProveedorMaterialApiController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function index(Request $request)
    {
        $proveedorMateriales = ProveedorMaterial::query();

        if ($search = $request->input('search')) {
            $normalizedSearch = $this->normalizeString($search);

            $proveedorMateriales = $proveedorMateriales->get()->filter(function ($proveedorMaterial) use ($normalizedSearch) {
                $normalizedNombre = $this->normalizeString($proveedorMaterial->nombre);

                return str_contains($normalizedNombre, $normalizedSearch);
            });
            $proveedorMateriales = $proveedorMateriales->values();
        } else {
            $proveedorMateriales = $proveedorMateriales->get();
        }
        return response()->json([
            'success' => true,
            'message' => 'Operación exitosa',
            'data' => $proveedorMateriales
        ], Response::HTTP_OK);
    }


    private function normalizeString($string)
    {
        $string = mb_strtolower($string);
        $string = preg_replace('/[^a-z0-9]/u', '', $string);
        return $string;
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:proveedor_de_material,nombre',
        ]);

        $proveedor = ProveedorMaterial::create($request->only('nombre'));

        return response()->json($proveedor, Response::HTTP_CREATED);
    }

    public function show($id)
    {

        $proveedor = ProveedorMaterial::find($id);

        if (!$proveedor) {
            return response()->json(['message' => 'Proveedor no encontrado'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($proveedor, Response::HTTP_OK);
    }

    public function update(Request $request, $id)
    {
        $proveedor = ProveedorMaterial::find($id);

        if (!$proveedor) {
            return response()->json(['message' => 'Proveedor no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $request->validate([
            'nombre' => 'required|string|max:255|unique:proveedor_de_material,nombre,' . $id,
        ]);

        $proveedor->update($request->only('nombre'));

        return response()->json($proveedor, Response::HTTP_OK);
    }

    public function destroy($id)
    {
        $proveedor = ProveedorMaterial::find($id);

        if (!$proveedor) {
            return response()->json(['message' => 'Proveedor no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $proveedor->delete();

        return response()->json(['message' => 'Proveedor eliminado'], Response::HTTP_OK);
    }
}

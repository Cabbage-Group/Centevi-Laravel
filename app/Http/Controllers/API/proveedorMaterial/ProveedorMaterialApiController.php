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
    public function index()
    {
        return response()->json([
            'data' => ProveedorMaterial::all()
        ], Response::HTTP_OK);
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

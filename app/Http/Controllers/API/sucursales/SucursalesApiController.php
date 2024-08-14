<?php

namespace App\Http\Controllers\API\sucursales;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sucursales;

class SucursalesApiController extends Controller
{
    public function sucursales(Request $request)
    {
        
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 7);
        $sortOrder = $request->query('sortOrder', 'asc');
        $sortColumn = $request->query('sortColumn', 'id_sucursal');
        $search = $request->input('search', '');  

       
        $request->validate([
            'page' => 'integer|min:1',
            'limit' => 'integer|min:1|max:100',
            'sortOrder' => 'in:asc,desc',
            'sortColumn' => 'string|in:id_sucursal,nombre,ubicacion,fecha_creacion',
            'search' => 'nullable|string|max:255',
        ]);

        $query = Sucursales::query();

        if (!empty($search)) {
        $query->where(function ($q) use ($search) {
            $q->where('nombre', 'LIKE', '%' . $search . '%')
              ->orWhere('ubicacion', 'LIKE', '%' . $search . '%');
        });
    }


        $query->orderBy($sortColumn, $sortOrder);

        
        $sucursales = $query->paginate($limit, ['*'], 'page', $page);


       
        return response()->json([
            'data' => $sucursales->items(),
            'meta' => [
                'page' => $sucursales->currentPage(),
                'limit' => $sucursales->perPage(),
                'total' => $sucursales->total(),
            ],
            'status' => [
                'code' => 200,
                'message' => 'Sucursales retrieved successfully',
            ],
        ]);
    }

    public function createSucursal(Request $request)
    {
     
        $request->validate([
            'nombre' => 'required|string|max:255',
            'ubicacion' => 'required|string|max:255',
            'fecha_creacion' => 'date',
           
        ]);

       
        $sucursal = Sucursales::create([
            'nombre' => $request->nombre,
            'ubicacion' => $request->ubicacion,
            'fecha_creacion' =>  now(),
        ]);

        return response()->json([
            'data' => $sucursal,
            'status' => [
                'code' => 201,
                'message' => 'Sucursal created successfully',
            ],
        ]);
    }


    public function updateSucursal(Request $request, $id)
    {
       
        $request->validate([
            'nombre' => 'string|max:255',
            'ubicacion' => 'string|max:255',
            'fecha_creacion' => 'date',
          
        ]);

       
        $sucursal = Sucursales::findOrFail($id);

       
        $sucursal->update($request->all());

        return response()->json([
            'data' => $sucursal,
            'status' => [
                'code' => 200,
                'message' => 'Sucursal updated successfully',
            ],
        ]);
    }


    public function deleteSucursal($id)
    {
      
        $sucursal = Sucursales::findOrFail($id);

       
        $sucursal->delete();

        return response()->json([
            'status' => [
                'code' => 200,
                'message' => 'Sucursal deleted successfully',
            ],
        ]);
    }
}

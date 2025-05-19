<?php

namespace App\Http\Controllers\API\products_interfuerza;

use App\Http\Controllers\Controller;
use App\Models\ProductInterfuerza;
use Illuminate\Http\Request;

class ProductsInterfuerzaApiController extends Controller
{
    public function obtenerProductos(Request $request)
    {
        $sortColumn = $request->query('sortColumn', 'created_at');
        $sortOrder = $request->query('sortOrder', 'asc');
        $page = $request->query('page');
        $limit = $request->query('limit');
        $search = $request->query('search');
        $filter = $request->query('filter');

        if (!in_array($sortOrder, ['asc', 'desc'])) {
            $sortOrder = 'asc';
        }

        $query = ProductInterfuerza::with('prices');

        if (!empty($search)) {
            $query->where('codigo', $search);
        }

        if (!empty($filter)) {
            $query->where(function ($q) use ($filter) {
                $q->where('nombre', 'like', "%$filter%")
                    ->orWhere('codigo', 'like', "%$filter%")
                    ->orWhere('type', 'like', "%$filter%")
                    ->orWhere('marca', 'like', "%$filter%")
                    ->orWhere('upc_code', 'like', "%$filter%")
                    ->orWhere('item_number', 'like', "%$filter%")
                    ->orWhere('category_l1', 'like', "%$filter%")
                    ->orWhere('proveedor_principal', 'like', "%$filter%")
                    ->orWhere('status', 'like', "%$filter%")
                    ->orWhere('ultimo_costo_unidad', 'like', "%$filter%")
                    ->orWhere('codigo_externo', 'like', "%$filter%");
            });
        }

        $query->orderBy($sortColumn, $sortOrder);

        if ($page && $limit) {
            $products = $query->paginate($limit, ['*'], 'page', $page);

            return response()->json([
                'data' => $products->items(),
                'meta' => [
                    'total' => $products->total(),
                    'limit' => $products->perPage(),
                    'page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                ]
            ]);
        } else {
            $products = $query->get();

            return response()->json([
                'data' => $products,
                'meta' => [
                    'total' => $products->count(),
                ]
            ]);
        }
    }

    public function crearProducts(Request $request)
    {
        try {

            $validatedData = $request->validate([
                'codigo' => 'required|string',
                'type' => 'required|string',
                'prod_madre' => 'nullable|string',
                'upc_code' => 'required|string|unique:products_interfuerza,upc_code',
                'item_number' => 'required|string|unique:products_interfuerza,item_number',
                'nombre' => 'required|string',
                'category_l1' => 'required|string',
                'category_l2' => 'required|string',
                'category_l3' => 'nullable|string',
                'codigo_externo' => 'nullable|string',
                'proveedor_principal' => 'nullable|string',
                'setup' => 'required|numeric',
                'ultimo_costo_unidad' => 'required|numeric',
                'peso' => 'nullable|numeric',
                'detalle' => 'nullable|string',
                'status' => 'required|string|in:ACTIVO,INACTIVO',
                'marca' => 'nullable|string',
                'grosor' => 'nullable|numeric',
                'ancho' => 'nullable|numeric',
                'altura' => 'nullable|numeric',
                'largo' => 'nullable|numeric',
                'matrix' => 'required|in:N,S',
                'matrix_child' => 'required|in:N,S',
                'color' => 'nullable|string',
                'talla' => 'nullable|string',
                'tax' => 'required|numeric',
                'volumen' => 'nullable|numeric',
                'lote' => 'nullable|string',
                'expiracion' => 'nullable|date',
                'has_promotion' => 'nullable|boolean',
                'has_promotion_type' => 'nullable|string',
                'has_promotion_value' => 'nullable|numeric',
                'has_promotion_default_price' => 'nullable|numeric',
                'has_promotion_date' => 'nullable|date',
                'service_price' => 'required|numeric',
                'service_setup' => 'required|numeric',
                'Prices_Definition' => 'nullable|array',
                'Prices_Definition.*.Price_List' => 'required_with:Prices_Definition|string',
                'Prices_Definition.*.Price' => 'required_with:Prices_Definition|numeric',
                'tags' => 'nullable|array',
                'tags.*' => 'string',
            ]);

            $product = ProductInterfuerza::create($validatedData);

            if (isset($validatedData['Prices_Definition']) && is_array($validatedData['Prices_Definition'])) {
                foreach ($validatedData['Prices_Definition'] as $price) {
                    $product->prices()->create([
                        'price_list' => $price['Price_List'],
                        'price' => $price['Price'],
                    ]);
                }
            }
            return response()->json(['message' => 'Producto creado', 'product' => $product->load('prices')], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Errores de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocurrió un error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function migrationProductsInterfuerza(Request $request)
    {
        $data = $request->all();

        if (isset($data['tags']) && !is_array($data['tags'])) {
            $data['tags'] = json_decode($data['tags'], true);
        }

        try {
            if (empty($data)) {
                return response()->json(['error' => 'No data provided for migration'], 400);
            }

            $itemNumbers = array_column($data, 'codigo');

            $existingItemNumbers = ProductInterfuerza::whereIn('codigo', $itemNumbers)
                ->pluck('codigo')
                ->toArray();

            $countExisting = count($existingItemNumbers);
            $countTotal = count($data);
            $countNew = $countTotal - $countExisting;

            ProductInterfuerza::upsert(
                $data,
                ['item_number'],
                [
                    'codigo',
                    'type',
                    'prod_madre',
                    'upc_code',
                    'nombre',
                    'category_l1',
                    'category_l2',
                    'category_l3',
                    'codigo_externo',
                    'proveedor_principal',
                    'setup',
                    'ultimo_costo_unidad',
                    'peso',
                    'detalle',
                    'status',
                    'marca',
                    'grosor',
                    'ancho',
                    'altura',
                    'largo',
                    'matrix',
                    'matrix_child',
                    'color',
                    'talla',
                    'tax',
                    'volumen',
                    'lote',
                    'expiracion',
                    'has_promotion',
                    'has_promotion_type',
                    'has_promotion_value',
                    'has_promotion_default_price',
                    'has_promotion_date',
                    'service_price',
                    'service_setup',
                    'tags'
                ]
            );

            $migratedProducts = ProductInterfuerza::whereIn('codigo', $itemNumbers)
                ->orderBy('id')
                ->get();

            return response()->json([
                'message' => 'Products migrated successfully',
                'inserted' => $countNew,
                'updated' => $countExisting,
                'migrated_products' => $migratedProducts,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteProductoInterfuerza()
    {
        try {
            foreach (ProductInterfuerza::with('prices')->get() as $product) {
                $product->prices()->delete();
                $product->delete();
            }

            return response()->json([
                'message' => 'Todos los registros han sido eliminados con éxito.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Hubo un error al eliminar los registros.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

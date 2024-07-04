<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


/**
 * @OA\Info(
 *      title= "apip de swwga",
 *      version="1.0",
 *        description="crud de students"
 * )
 * 
 */
class TestController extends Controller
{
   /**
     * @OA\Get(
     *     path="/api/items",
     *     summary="Obtener todos los elementos",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de elementos",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="description", type="string"),
     *             )
     *         )
     *     )
     * )
     */
    private $items = [
        ['id' => 1, 'name' => 'Item 1', 'description' => 'Descripción del Item 1'],
        ['id' => 2, 'name' => 'Item 2', 'description' => 'Descripción del Item 2'],
    ];

    public function index()
    {
        return response()->json($this->items);
    }

     /**
     * @OA\Get(
     *     path="/api/items/{id}",
     *     summary="Obtener un elemento por ID",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del elemento",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Elemento encontrado",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="Item 1"),
     *             @OA\Property(property="description", type="string", example="Descripción del Item 1"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Elemento no encontrado"
     *     )
     * )
     */
    public function show($id)
    {
        $item = $this->findItemById($id);
        if (!$item) {
            return response()->json(['error' => 'Item not found'], 404);
        }
        return response()->json($item);
    }

        /**
     * @OA\Post(
     *     path="/api/items",
     *     summary="Crear un nuevo elemento",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","description"},
     *             @OA\Property(property="name", type="string", example="Nuevo Item"),
     *             @OA\Property(property="description", type="string", example="Descripción del Nuevo Item"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Elemento creado exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="Nuevo Item"),
     *             @OA\Property(property="description", type="string", example="Descripción del Nuevo Item"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
        ]);

        $item = [
            'id' => count($this->items) + 1,
            'name' => $data['name'],
            'description' => $data['description'],
        ];

        $this->items[] = $item;

        return response()->json($item, 201);
    }


    /**
     * @OA\Put(
     *     path="/api/items/{id}",
     *     summary="Actualizar un elemento existente",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del elemento",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","description"},
     *             @OA\Property(property="name", type="string", example="Item Actualizado"),
     *             @OA\Property(property="description", type="string", example="Nueva descripción"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Elemento actualizado exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="Item Actualizado"),
     *             @OA\Property(property="description", type="string", example="Nueva descripción"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Elemento no encontrado"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        $item = $this->findItemById($id);
        if (!$item) {
            return response()->json(['error' => 'Item not found'], 404);
        }

        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
        ]);

        $item['name'] = $data['name'];
        $item['description'] = $data['description'];

        return response()->json($item);
    }
  /**
     * @OA\Delete(
     *     path="/api/items/{id}",
     *     summary="Eliminar un elemento",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del elemento",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Elemento eliminado exitosamente"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Elemento no encontrado"
     *     )
     * )
     */
    public function destroy($id)
    {
        $index = $this->findItemIndexById($id);
        if ($index === false) {
            return response()->json(['error' => 'Item not found'], 404);
        }

        array_splice($this->items, $index, 1);

        return response()->json(['message' => 'Item deleted']);
    }

    private function findItemById($id)
    {
        foreach ($this->items as $item) {
            if ($item['id'] == $id) {
                return $item;
            }
        }
        return null;
    }

    private function findItemIndexById($id)
    {
        foreach ($this->items as $index => $item) {
            if ($item['id'] == $id) {
                return $index;
            }
        }
        return false;
    }
}

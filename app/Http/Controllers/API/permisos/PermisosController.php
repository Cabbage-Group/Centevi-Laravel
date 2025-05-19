<?php

namespace App\Http\Controllers\API\permisos;

use App\Http\Controllers\Controller;
use App\Models\Permisos;
use App\Models\PermisosTiposUsuarios;
use App\Models\TiposPermisos;
use App\Models\TiposUsuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class PermisosController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->input('limit', 10);
        $page = $request->input('page', 1);
        $slug = $request->input('slug');
        $descripcion = $request->input('descripcion');
        $sortColumn = $request->input('sortColumn', 'id');
        $sortOrder = $request->input('sortOrder', 'asc');
    
        try {
            // Construir la consulta con condiciones
            $query = TiposPermisos::with('permisos');
    
            // Aplicar filtros de búsqueda
            if ($slug) {
                $query->whereHas('permisos', function ($query) use ($slug) {
                    $query->where('slug', 'LIKE', "%$slug%");
                });
            }
    
            if ($descripcion) {
                $query->whereHas('permisos', function ($query) use ($descripcion) {
                    $query->where('descripcion', 'LIKE', "%$descripcion%");
                });
            }
    
            // Ordenar y paginar
            $tiposPermisos = $query->orderBy($sortColumn, $sortOrder)
                ->paginate($limit, ['*'], 'page', $page);
    
            // Mapear resultados
            $tipos = $tiposPermisos->map(function ($tipoPermiso) {
                return [
                    'id_tipo_permiso' => $tipoPermiso->id,
                    'tipo_permiso' => $tipoPermiso->tipo,
                    'permisos' => $tipoPermiso->permisos->map(function ($permiso) {
                        return [
                            'id' => $permiso->id,
                            'descripcion' => $permiso->descripcion,
                            'slug' => $permiso->slug,
                        ];
                    }),
                ];
            });
    
            // Verificar si se encontraron tipos de permisos
            if ($tipos->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'message' => 'No se encontraron tipos de permisos',
                    'data' => [],
                ]);
            }
    
            // Meta para paginación
            $meta = [
                'limit' => $limit,
                'page' => $page,
                'total' => $tiposPermisos->total(),
                'slug' => $slug,
                'descripcion' => $descripcion,
                'sortColumn' => $sortColumn,
                'sortOrder' => $sortOrder,
            ];
    
            return response()->json([
                'success' => true,
                'message' => 'Operación exitosa',
                'data' => $tipos,
                'meta' => $meta,
            ]);
        } catch (\Exception $e) {
            // Manejo de errores
            return response()->json([
                'success' => false,
                'message' => 'Error en la base de datos',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function create(Request $request)
    {
        // Validar la solicitud
        $validator = Validator::make($request->all(), [
            'tipo_permiso_id' => 'required|exists:tipos_permisos,id',
            'slug' => 'required|string|max:250|unique:permisos,slug',
            'ruta' => 'required|string|max:150',
            'descripcion' => 'nullable|string|max:250',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Crear un nuevo permiso
            $permiso = new Permisos();
            $permiso->tipo_permiso_id = $request->input('tipo_permiso_id');
            $permiso->slug = $request->input('slug');
            $permiso->ruta = $request->input('ruta');
            $permiso->descripcion = $request->input('descripcion');
            $permiso->save();

            return response()->json([
                'success' => true,
                'message' => 'Permiso creado exitosamente',
                'data' => $permiso,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el permiso',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function createOrUpdatePermisosUsuario(Request $request)
    {
        // Validar los datos de entrada
        $validated = $request->validate([
            'permiso_id' => 'required|array',          // Un array de permisos
            'permiso_id.*' => 'exists:permisos,id',    // Cada permiso debe existir en la tabla permisos
            'tipo_usuario_id' => 'required|exists:tipos_usuarios,id',  // El tipo de usuario debe existir
        ]);

        $permisoIds = $validated['permiso_id'];
        $tipoUsuarioId = $validated['tipo_usuario_id'];

        try {
            // Obtener el tipo de usuario
            $tipoUsuario = TiposUsuario::find($tipoUsuarioId);
            if (!$tipoUsuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'El tipo de usuario no existe en la tabla TIPO_USUARIO',
                ], 404);
            }

            // Verificar que todos los permisos existen
            $permisos = Permisos::whereIn('id', $permisoIds)->get();
            if ($permisos->count() !== count($permisoIds)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Un permiso_id no existe en la tabla PERMISOS',
                ], 404);
            }

            // Eliminar los permisos actuales del tipo de usuario
            PermisosTiposUsuarios::where('tipo_usuario_id', $tipoUsuarioId)->delete();

            // Asignar los nuevos permisos al tipo de usuario
            $permisoUsuarioData = array_map(function($permisoId) use ($tipoUsuarioId) {
                return [
                    'tipo_usuario_id' => $tipoUsuarioId,
                    'permiso_id' => $permisoId,
                ];
            }, $permisoIds);

            // Insertar los nuevos permisos en la tabla permisos_tipos_usuarios
            PermisosTiposUsuarios::insert($permisoUsuarioData);

            return response()->json([
                'success' => true,
                'message' => 'Operación exitosa',
                'data' => $permisoUsuarioData,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear o actualizar los permisos',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function findAllUsuarioPermisos($ids, Request $request)
{
    $search = $request->input('search');

    try {
        // Obtener tipos de permisos con sus permisos
        $tiposPermiso = TiposPermisos::with('permisos:id,descripcion,tipo_permiso_id')->get();

        // Obtener permisos del usuario
        $permisosUsuario = PermisosTiposUsuarios::where('tipo_usuario_id', $ids)
            ->pluck('permiso_id')
            ->toArray();

        // Agrupar permisos por tipo
        $agrupamiento = $tiposPermiso->map(function ($tipo) use ($permisosUsuario) {
            return [
                'id' => $tipo->id,
                'tipo_permiso' => $tipo->tipo,
                'permisos' => $tipo->permisos->map(function ($permiso) use ($permisosUsuario) {
                    return [
                        'id' => $permiso->id,
                        'permiso' => $permiso->descripcion,
                        'seleccionado' => in_array($permiso->id, $permisosUsuario),
                    ];
                })->toArray()
            ];
        });

        // Aplicar búsqueda si se proporciona
        if ($search) {
            $terminoBusqueda = strtolower($search);
            $agrupamiento = $agrupamiento->map(function ($agrup) use ($terminoBusqueda) {
                $agrup['permisos'] = array_filter($agrup['permisos'], function ($perm) use ($agrup, $terminoBusqueda) {
                    return stripos($agrup['tipo_permiso'], $terminoBusqueda) !== false ||
                           stripos($perm['permiso'], $terminoBusqueda) !== false;
                });
                return $agrup;
            })->filter(function ($agrup) {
                return count($agrup['permisos']) > 0;
            });
        }

        return response()->json(['success' => true, 'message' => 'Operación Exitosa', 'data' => $agrupamiento]);

    } catch (\Exception $error) {
        return response()->json(['success' => false, 'message' => $error->getMessage()], 500);
    }
}


}

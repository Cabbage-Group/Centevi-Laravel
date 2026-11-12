<?php

namespace App\Http\Controllers\API\favoritos;

use App\Http\Controllers\Controller;
use App\Models\FavoritoUsuario;
use Illuminate\Http\Request;

class FavoritosApiController extends Controller
{
  public function index(Request $request)
  {
    $request->validate(['id_usuario' => 'required|integer']);

    $favoritos = FavoritoUsuario::where('id_usuario', $request->query('id_usuario'))
      ->orderBy('titulo')
      ->get();

    return response()->json(['data' => $favoritos]);
  }

  // Agrega la URL a favoritos si no existe; si ya existe, la quita
  public function toggle(Request $request)
  {
    $data = $request->validate([
      'id_usuario' => 'required|integer',
      'url' => 'required|string|max:255',
      'titulo' => 'required|string|max:150',
      'modulo' => 'nullable|string|max:100',
    ]);

    $existente = FavoritoUsuario::where('id_usuario', $data['id_usuario'])
      ->where('url', $data['url'])
      ->first();

    if ($existente) {
      $existente->delete();

      return response()->json(['favorito' => false, 'data' => $existente]);
    }

    $favorito = FavoritoUsuario::create($data);

    return response()->json(['favorito' => true, 'data' => $favorito], 201);
  }

  public function destroy(Request $request, $id)
  {
    $request->validate(['id_usuario' => 'required|integer']);

    FavoritoUsuario::where('id_favorito', $id)
      ->where('id_usuario', $request->query('id_usuario'))
      ->delete();

    return response()->json(['message' => 'Favorito eliminado']);
  }
}

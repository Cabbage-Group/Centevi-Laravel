<?php

namespace App\Http\Controllers\API\email;

use App\Http\Controllers\Controller;
use App\Mail\VerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
  public function sendVerificationEmail(Request $request)
  {
    $request->validate(['email' => 'required|email']);

    $code = rand(100000, 999999); // Genera un código aleatorio

    Mail::to($request->email)->send(new VerifyEmail($code));

    return response()->json(['message' => 'Correo enviado', 'code' => $code]);
  }
}

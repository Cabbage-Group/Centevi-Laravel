<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class rutasController extends Controller
{
    public function index(){
        return view('welcome');
    }

    public function login(){
        return view('login');
    }   

    public function home(){
        return view('partials.sidebar');
    }   

}

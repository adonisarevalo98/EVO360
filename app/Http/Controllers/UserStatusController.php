<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserStatus;
class UserStatusController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $userstatus = UserStatus::all();
                //retornando json para frontend
         return response()->json($userstatus);
            } catch (\Throwable $th) {
                return response()->json($th);
            }
     
    }
}

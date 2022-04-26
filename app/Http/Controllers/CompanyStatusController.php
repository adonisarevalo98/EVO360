<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CompanyStatus;
class CompanyStatusController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $companystatus = CompanyStatus::all();
                //retornando json para frontend
         return response()->json($companystatus);
            } catch (\Throwable $th) {
                return response()->json($th);
            }
     
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EvaluationStatus;
class EvaluationStatusController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $evastatus = EvaluationStatus::all();
                //retornando json para frontend
         return response()->json($evastatus);
            } catch (\Throwable $th) {
                return response()->json($th);
            }
     
    }
}

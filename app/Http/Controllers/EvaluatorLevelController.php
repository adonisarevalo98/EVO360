<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EvaluatorLevel;
class EvaluatorLevelController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $evaluatorlvl = EvaluatorLevel::all();
                //retornando json para frontend
         return response()->json($evaluatorlvl);
            } catch (\Throwable $th) {
                return response()->json($th);
            }
     
    }
}

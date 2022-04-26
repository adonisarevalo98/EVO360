<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EvaluatorStatus;
class EvaluatorStatusController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $evastatus = EvaluatorStatus::all();
                //retornando json para frontend
         return response()->json($evastatus);
            } catch (\Throwable $th) {
                return response()->json($th);
            }
     
    }

   
}

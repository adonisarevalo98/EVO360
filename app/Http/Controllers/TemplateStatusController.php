<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TemplateStatus;
class TemplateStatusController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $tempstatus = TemplateStatus::all();
                //retornando json para frontend
         return response()->json($tempstatus);
            } catch (\Throwable $th) {
                return response()->json($th);
            }
     
    }
}

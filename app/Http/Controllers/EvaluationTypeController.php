<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EvaluationType;
class EvaluationTypeController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $evatype = EvaluationType::all();
                //retornando json para frontend
         return response()->json($evatype);
            } catch (\Throwable $th) {
                throw $th;
            }
     
    }

            /********************************************************************* */
    public function store(Request $request)
    {
        
        //creando obj del modelo EvaluationType para guardar nuevo registro
        $evatype = new EvaluationType();
 
        //asignando datos del request al objeto
        $evatype->evatype = $request->input('type');
        $evatype->description = $request->input('description');
        
        //guardando evatype
        try {
            $evatype->save();
            $result=[
                'status'=>200,
                'result' => 'OK',
            ];
        } catch (\Throwable $th) {
            $result=[
                'status'=>400,
                'result' => 'ERROR',
            ];
        }
       
        return response()->json($result);
       
    }

        /********************************************************************* */
   //Metodo para selección de departamento segun su ID
    public function show($id)
    {
      
        try { 
        $evatype = EvaluationType::select('*')
            ->where('id', '=', $id)
            ->get();
         return response()->json($evatype);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

               /********************************************************************* */
    public function update(Request $request, $id)
    {
        //seleccionando registro segun id para modifircarlo
        $evatype = EvaluationType::find($id);
    
        //asignando datos del request al objeto
         $evatype->evatype = $request->input('type');
        $evatype->description = $request->input('description');

        //guardando cambios en el registro
        try {
            $evatype->save();
            $result=[
                'status'=>200,
                'result' => 'OK',
            ];
        } catch (\Throwable $th) {
            $result=[
                'status'=>400,
                'result' => 'ERROR',
            ];
        }
       
        return response()->json($result);
    }

            /********************************************************************* */
    public function destroy($id)
    {
        //buscando registro por id
        $evatype = EvaluationType::find($id);
        try {
            $evatype->delete();
            $result=[
                'status'=>200,
                'result' => 'OK',
            ];
        } catch (\Throwable $th) {
            $result=[
                'status'=>400,
                'result' => 'ERROR',
            ];
        }
       
        return response()->json($result);
    }

}

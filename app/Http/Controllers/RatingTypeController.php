<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rating_Type;
class RatingTypeController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $rating_type = Rating_type::all();
                //retornando json para frontend
         return response()->json($rating_type);
            } catch (\Throwable $th) {
                throw $th;
            }
     
    }

            /********************************************************************* */
    public function store(Request $request)
    {
        
        //creando obj del modelo Rating_type para guardar nuevo registro
        $rating_type = new Rating_type();
 
        //asignando datos del request al objeto
        $rating_type->id_evaluation_item = $request->input('type');
        $rating_type->id_evaluator = $request->input('description');
        
        //guardando rating_type
        try {
            $rating_type->save();
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
        $rating_type = Rating_type::select('*')
            ->where('id', '=', $id)
            ->get();
         return response()->json($rating_type);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

               /********************************************************************* */
    public function update(Request $request, $id)
    {
        //seleccionando registro segun id para modifircarlo
        $rating_type = Rating_type::find($id);
    
        //asignando datos del request al objeto
        $rating_type->id_evaluation_item = $request->input('type');
        $rating_type->id_evaluator = $request->input('description');

        //guardando cambios en el registro
        try {
            $rating_type->save();
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
        $rating_type = Rating_type::find($id);
        try {
            $rating_type->delete();
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

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CalculationAlgorithm;
class CalculationAlgorithmController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $algorithm = CalculationAlgorithm::all();
                //retornando json para frontend
         return response()->json($algorithm);
            } catch (\Throwable $th) {
                throw $th;
            }
     
    }

            /********************************************************************* */
    public function store(Request $request)
    {
        
        //creando obj del modelo CalculationAlgorithm para guardar nuevo registro
        $algorithm = new CalculationAlgorithm();
 
        //asignando datos del request al objeto
        $algorithm->algorithm = $request->input('title');
        $algorithm->description = $request->input('description');
        
        //guardando algorithm
        try {
            $algorithm->save();
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
        $algorithm = CalculationAlgorithm::select('*')
            ->where('id', '=', $id)
            ->get();
         return response()->json($algorithm);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

               /********************************************************************* */
    public function update(Request $request, $id)
    {
        //seleccionando registro segun id para modifircarlo
        $algorithm = CalculationAlgorithm::find($id);
    
        //asignando datos del request al objeto
         $algorithm->algorithm = $request->input('title');
        $algorithm->description = $request->input('description');

        //guardando cambios en el registro
        try {
            $algorithm->save();
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
        $algorithm = CalculationAlgorithm::find($id);
        try {
            $algorithm->delete();
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

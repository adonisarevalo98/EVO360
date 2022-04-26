<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Score;
class ScoreController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $score = Score::all();
                //retornando json para frontend
         return response()->json($score);
            } catch (\Throwable $th) {
                throw $th;
            }
     
    }

            /********************************************************************* */
    public function store(Request $request)
    {
        
        $scores = $request->input('scores');
        try {
            //Recorriendo lista de resultados donde $key es id_evaluation_item asignado como 
            // FormControl de cada item (asignado de forma dinamica en el FormGroup) y 
            //$value es el valor obtenido del mat-radio-button seleccionado por el usuario
        foreach($scores as $key => $value){
            //creando obj del modelo Score para guardar nuevo registro
        $score = new Score();
          //asignando datos del request al objeto
          $score->id_evaluator = $request->input('id_evaluator');
          $score->id_evaluation_item = $key;
          $score->value = $value;
        //guardando score
       
            $score->save();
            $result=[
                'status'=>200,
                'result' => 'OK',
            ];
      
           
        }
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
        $score = Score::select('*')
            ->where('id', '=', $id)
            ->get();
         return response()->json($score);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

               /********************************************************************* */
    public function update(Request $request, $id)
    {
        //seleccionando registro segun id para modifircarlo
        $score = Score::find($id);
    
        //asignando datos del request al objeto
        $score->id_evaluation_item = $request->input('id_evaluation_item');
        $score->id_evaluator = $request->input('id_evaluator');
        $score->value = $request->input('value');

        //guardando cambios en el registro
        try {
            $score->save();
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
        $score = Score::find($id);
        try {
            $score->delete();
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

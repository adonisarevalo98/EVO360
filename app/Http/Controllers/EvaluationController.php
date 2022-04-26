<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Evaluation;
class EvaluationController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $evaluation = Evaluation::all();
                //retornando json para frontend
         return response()->json($evaluation);
            } catch (\Throwable $th) {
                throw $th;
            }
     
    }

    /********************************************************************* */
//Método para lista de evaluaciones/autoevaluaciones
public function list_evaluations($type)
{
    //seleccionando todos los registros de la tabla por medio del modelo

        try {
            $evaluation = Evaluation::select('*')
            ->where('type','=',$type)
            ->get();
            //retornando json para frontend
     return response()->json($evaluation);
        } catch (\Throwable $th) {
            throw $th;
        }
 
}

            /********************************************************************* */
    public function store(Request $request)
    {
        try {
        //Validando si el titulo no esta en uso 
        $eva_title = Evaluation::where('title',$request['title'])->first();
        if($eva_title==null){
        //creando obj del modelo Evaluation para guardar nuevo registro
        $evaluation = new Evaluation();
 
        //asignando datos del request al objeto
        $evaluation->title = $request->input('title');
        $evaluation->description = $request->input('description');
        $evaluation->start_date = $request->input('start_date');
        $evaluation->end_date = $request->input('end_date');
        $evaluation->status = $request->input('status');
        $evaluation->type = $request->input('type');
     if($request->input('start_date')>date('Y-m-dTH:i')){
         $val1 = true;
        
     }else{
        $val1 = false;
        $response = 'La fecha de inicio no puede ser menor a la actual';
     }
     if($request->input('end_date')>=$request->input('start_date'))  {
         $val2 = true;
     }else{
         $val2 = false;
         $response = 'La fecha de cierre no puede ser menor que la fecha de inicio';
     }
     //Si las fechas de inicio y cierre estan correctas
     if($val1==true && $val2==true){
          //guardando evaluation
          $evaluation->save();
          //para obtener id del record despues del guardado: $evaluation->id;
          $result=[
              'status'=>200,
              'result' => 'OK',
              'id_evaluation'=>$evaluation->id,
          ];
     }else{//Si las fechas estan incorrectas
        $result=[
            'status'=>401,
            'result' => 'INCORRECT',
            'response'=> $response 
        ];
     }
        }else{//Si el título ya esta en uso
            $result=[
                'status'=>401,
                'result' => 'NO',
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
        $evaluation = Evaluation::select('*')
            ->where('id', '=', $id)
            ->get();
         return response()->json($evaluation);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

               /********************************************************************* */
    public function update(Request $request, $id)
    {
        //seleccionando registro segun id para modifircarlo
        $evaluation = Evaluation::find($id);
    
        //asignando datos del request al objeto
        $evaluation->title = $request->input('title');
        $evaluation->description = $request->input('description');
        $evaluation->start_date = $request->input('start_date');
        $evaluation->end_date = $request->input('end_date');
        $evaluation->status = $request->input('status');

        //guardando cambios en el registro
        try {
            $evaluation->save();
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
        $evaluation = Evaluation::find($id);
        try {
            $evaluation->delete();
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

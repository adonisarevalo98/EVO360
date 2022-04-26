<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question_Template;
use DB;
class QuestionTemplateController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $question_temp = Question_Template::all();
                //retornando json para frontend
         return response()->json($question_temp);
            } catch (\Throwable $th) {
                throw $th;
            }
     
    }

            /********************************************************************* */
    public function store(Request $request)
    {
        
        //creando obj del modelo Question_Template para guardar nuevo registro
        $question_temp = new Question_Template();
 
        //asignando datos del request al objeto
        $question_temp->type = $request->input('type');
        $question_temp->description = $request->input('description');
        $question_temp->status = $request->input('status');
        $question_temp->group = $request->input('group');
        
        //guardando question_temp
        try {
            $question_temp->save();
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
        $question_temp = Question_Template::select('*')
            ->where('id', '=', $id)
            ->get();
         return response()->json($question_temp);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

               /********************************************************************* */
    public function update(Request $request, $id)
    {
        //seleccionando registro segun id para modifircarlo
        $question_temp = Question_Template::find($id);
    
        //asignando datos del request al objeto
        $question_temp->type = $request->input('type');
        $question_temp->description = $request->input('description');
        $question_temp->status = $request->input('status');
        $question_temp->group = $request->input('group');
        

        //guardando cambios en el registro
        try {
            $question_temp->save();
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
        $question_temp = Question_Template::find($id);
        try {
            $question_temp->delete();
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
   //Metodo para listar plantillas en estado activo y con items asignados
   public function list_active_temps()
   {
     
       try { 
           $question_temp = DB::table('question_templates as questemps')
           ->join('items as items','items.id_template','=','questemps.id')
           ->where('questemps.status', '=', 1)
           ->select('questemps.id','questemps.type')
           ->groupBy('questemps.id')
           ->get();
           
        return response()->json($question_temp);
       } catch (\Throwable $th) {
           throw $th;
       }
   }
}

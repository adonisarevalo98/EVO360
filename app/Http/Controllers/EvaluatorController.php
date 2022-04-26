<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Evaluator;
use DB;
class EvaluatorController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $evaluator = Evaluator::all();
                //retornando json para frontend
         return response()->json($evaluator);
            } catch (\Throwable $th) {
                throw $th;
            }
     
    }

            /********************************************************************* */
    public function store(Request $request)
    {
        try {
            //Validamos si se ha recibido una lista usuarios (al crear una evaluación)
            // o solo un usuario (al asignar un evaluador a una evaluación)
        if($request->input('user')!=null){
            //obtenemos la lista de usuarios (evaluado y creador) 
            $users= $request->input('user');

            //Recorremos la lista e insertamos los usuarios en la tabla
          //Si comparamos con el objeto enviado desde angular $users es el objeto user,
          //$key serán user y creator; $value serán id y level.  
    foreach($users as $key => $value){
        //creando obj del modelo Evaluator para guardar nuevo registro
        //el objeto debe ser creado dentro del loop ya que no puede ser reescrito fuera de él
        $user = new Evaluator();
        //obtenemos el id de la evaluación para asignarle los usuarios
       $user->id_evaluation = $request->input('id_evaluation');
       //asignando datos del request al objeto
       $user->id_user = $value['id'];
       $user->level = $value['level'];
       $user->status = $value['status'];
        //guardando usuarios
        $user->save(); 
   }
        }else{ //En caso de que solo se reciba un usuario (nuevo evaluador)
            $newevaluator=$request;
              //creando obj del modelo Evaluator para guardar nuevo registro
              $evaluator = new Evaluator();
              //obtenemos el id de la evaluación para asignarle al usuario
             $evaluator->id_evaluation = $newevaluator->input('id_evaluation');
              //asignando datos del request al objeto
              $evaluator->id_user = $newevaluator->input('id_user');
              $evaluator->level = $newevaluator->input('level');
             $evaluator->status = $newevaluator->input('status');
            //guardando usuario
             $evaluator->save(); 
        }
    
         $result=[
            'status'=>200,
            'result' => 'OK'
        ];
    } catch (\Throwable $th) {
        $result=[
            'status'=>400,
            'result' => 'ERROR',
            'response' => 'Evaluator Fail',
        ];
    }  

    return response()->json($result);
 
   
        
    }

        /********************************************************************* */
   //Metodo para selección de departamento segun su ID
    public function show($id)
    {
      
        try { 
        $evaluator = Evaluator::select('*')
            ->where('id', '=', $id)
            ->get();
         return response()->json($evaluator);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

               /********************************************************************* */
    public function update(Request $request, $id)
    {
        //seleccionando registro segun id para modifircarlo
        $evaluator = Evaluator::find($id);
    
        //asignando datos del request al objeto
        $evaluator->id_evaluation = $request->input('id_evaluation');
        $evaluator->id_user = $request->input('id_user');
        $evaluator->level = $request->input('level');

        //guardando cambios en el registro
        try {
            $evaluator->save();
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
        $evaluator = Evaluator::find($id);
        try {
            $evaluator->delete();
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
      //Query para listar evaluaciones segun el id de usuario si es creador o evaluador
      public function  evaluations_by_user($id,$type){
          if($type==1){ //Si se van a listar evaluaciones
              $condition='<>';//Se listan aquellas donde el usuario NO ES el evaluado
          }else if($type==2){//Si se van a listar autoevaluaciones
             $condition='=';//Se listan aquellas donde el usuario ES el evaluado
          }
        try {
            $evaluations = DB::table('evaluators as evtr')
            ->join('evaluations as eva', 'eva.id', '=', 'evtr.id_evaluation')//evaluators a evaluations
            ->where( [
                    ['evtr.id_user', '=', $id],
                    ['evtr.level',$condition,3],
                    ['eva.type','=',$type]
                ])
            ->select('eva.id','evtr.level','evtr.status as evt_status','eva.title',
            'eva.start_date','eva.end_date','eva.status')
            ->get();
         return response()->json($evaluations);
         
        } catch (\Throwable $th) {
            $response = [
                "status" => 400,
                "result" => "Error"
            ];
            return response()->json($response);
        }
        
    }
     /********************************************************************* */
      //Query para listar evaluadores pertenecientes a una evaluación
      public function  evaluators_by_evaluation($id_user,$id_evaluation){
        try {
            $evaluators = DB::table('evaluators as evtr')
            ->join('users as usr', 'usr.id', '=', 'evtr.id_user')//evaluators a users
            ->join('employments as emp','emp.id','=','usr.id_employment')
            ->join('evaluator_levels as evlvl','evlvl.id','=','evtr.level')
            ->where( [
                    ['evtr.id_evaluation', '=', $id_evaluation],//Lista de evaluadores
                    ['evtr.level','=',2]
                ])
            ->orWhere([                                        //o lista de creadores 
                ['evtr.id_evaluation','=',$id_evaluation],     //Solo para administradores
                ['evtr.level','=',1],
                ['evtr.id_user','<>',$id_user]
            ])
            ->select('evtr.id','evtr.level as id_level','evlvl.level','usr.name','usr.last_name','emp.employment')
            ->get();
         return response()->json($evaluators);
         
        } catch (\Throwable $th) {
            $response = [
                "status" => 400,
                "result" => "Error"
            ];
            return response()->json($response);
        }
        
    }
    /********************************************************************* */
      //Query para obtener id y nombre de la empresa a la que pertene el EVALUADO
      // de una evaluación
      public function  companies_by_evaluated($id){
        try {
            $companies = DB::table('evaluators as evtr')
            ->join('users as usr', 'usr.id', '=', 'evtr.id_user')//evaluators a users
            ->join('employments as emp','emp.id','=','usr.id_employment')//users a employments
            ->join('departments as dep','dep.id','=','emp.id_department')//employments a departmens
            ->join('companies as comp','comp.id','=','dep.id_company')//departments a companies
            ->where( [
                    ['evtr.id_evaluation', '=', $id],
                    ['evtr.level','=',3]
                ])
            ->select('comp.id','comp.company')
            ->get();
         return response()->json($companies);
         
        } catch (\Throwable $th) {
            $response = [
                "status" => 400,
                "result" => "Error"
            ];
            return response()->json($response);
        }
        
    }

     /********************************************************************* */
      //Query para obtener los datos del evaluado
      // de una evaluación
      public function  evaluated_of_evaluation($id){
        try {
            $evaluated =  DB::table('evaluators as evtr')
            ->join('users as usr','usr.id','=','evtr.id_user')
            ->where([
                ['evtr.id_evaluation', '=', $id],
                ['evtr.level','=',3]
                ])
            ->select('usr.name','usr.last_name','evtr.id_user')
            ->get();
            return response()->json($evaluated);
        } catch (\Throwable $th) {
            $response = [
                "status" => 400,
                "result" => "Error"
            ];
            return response()->json($response);
        }
        
    }
/********************************************************************* */
      //Query para obtener el id de evaluador o creador de un usuario
      public function evaluator_of_evaluation($id_user,$id_evaluation){
        try {
            $evaluator = Evaluator::select('id','level')
            ->where([
                ['id_evaluation', '=', $id_evaluation],
                ['id_user','=',$id_user],
                ])
            ->get();
            return response()->json($evaluator);
        } catch (\Throwable $th) {
            $response = [
                "status" => 400,
                "result" => "Error"
            ];
            return response()->json($response);
        }
      }

}

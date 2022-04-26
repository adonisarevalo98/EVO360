<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Validator;
//importacion de modelo 
use App\Models\User;
use DB;
class UserController extends Controller
{
    

    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $users = User::all();
                //retornando json para frontend
         return response()->json($users);
            } catch (\Throwable $th) {
                throw $th;
            }
     
    }

            /********************************************************************* */
    public function store(Request $request)
    {
         //buscando email ingresado para validar su existencia
         $emails = User::select('id')
         ->where('email', '=', $request->input('email'))
         ->get();
        //creando obj del modelo User para guardar nuevo registro
        $user = new User();
 //validando email (no repetido) y contraseña (8 caracteres)
            $validator = Validator::make($request->all(),[
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8'
            ]);
    
            if($validator->fails()){
               return $result=[
                    'status'=>401,
                    'result' => 'NO',
                ];       
            }else{
        //asignando datos del request al objeto
                $user->name = $request->input('name');
                $user->last_name = $request->input('last_name');
                $user->email = $request->input('email');
                $user->password = Hash::make($request->input('password'));
                $user->avatar = $request->input('avatar');
                $user->id_user_category = $request->input('id_user_category');
                $user->id_employment = $request->input('id_employment');
                $user->status = $request->input('status');

                //guardando user
                try {
                    $user->save();
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
            }
      
        return response()->json($result);
    }

        /********************************************************************* */
   //Metodo para selección de usuario segun su ID
    public function show($id)
    {
      
        try {
        
         $users = DB::table('users as usr')
         ->join('employments as emp', 'emp.id', '=', 'usr.id_employment')
         ->join('departments as dpt', 'dpt.id', '=', 'emp.id_department')
         ->join('companies as comp','comp.id','=','dpt.id_company')
         ->where('usr.id', '=', $id)
         ->select('usr.*','dpt.id as id_department','comp.id as id_company')
         ->get();
        //"password as pass" permite obtener la contraseña de la tabla 
        /*$users = User::select('*','password as pass')
            ->where('id', '=', $id)
            ->get();*/
         return response()->json($users);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

               /********************************************************************* */
    public function update(Request $request, $id)
    {
           //buscando correo email ingresado para validar su existencia
           $emails = User::select('id')
           ->where('email', '=', $request->input('email'))
           ->get();

        //seleccionando registro segun id para modifircarlo
        $user = User::find($id);
        //Variable que almacena la antigua contraseña
        $passOld = $user->password;
         //Variable que almacena la nueva contraseña
         $passNew = $request->input('password');
         //Variable que almacena el email y contraseña a guardar
         $email = "";
         $pass = "";
         //validando email (formato) y contraseña (8 caracteres)
         $validator = Validator::make($request->all(),[
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8'
        ]);

        if($validator->fails()){
            $result=[
                'status'=>401,
                'result' => 'NO',
            ];       
        }else{
        //validando si el email ingresado es del usuario actual ó no esta siendo ocupado por ningun usuario
        if(  sizeof($emails) == null || ($emails[0]->id) == $id ){
        //si la contraseña no se modificó
        if(($passNew == $passOld) ){
         $pass = $passOld;
        //si la contraseña se modificó
        }else{
            $pass = Hash::make($passNew);
        }
        //asignando datos del request al objeto
        $user->name = $request->input('name');
        $user->last_name = $request->input('last_name');
        $user->email = $request->input('email');
        $user->password = $pass;
        $user->avatar = $request->input('avatar');
        $user->id_user_category = $request->input('id_user_category');
        $user->id_employment = $request->input('id_employment');
        $user->status = $request->input('status');

        //guardando cambios en el registro
        try {
            $user->save();
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
    }else{
        $result=[
            'status'=>401,
            'result' => 'DENIED',
        ];
        }
    }
       
        return response()->json($result);
    }

            /********************************************************************* */
    public function destroy($id)
    {
        //buscando registro por id
        $user = User::find($id);
        if($user->delete()){
            $result=[
                'status'=>200,
                'result' => 'OK',
            ];
        }else{
            $result=[
                'status'=>400,
                'result' => 'ERROR',
            ];
        }
       
        return response()->json($result);
    }

              /********************************************************************* */
    public function list_users(Request $request ){//Query para listar usuarios exepto a quien solicita
        try {
            $users = DB::table('users as usr')
            ->join('employments as emp', 'emp.id', '=', 'usr.id_employment')//users a employments
            ->join('departments as dep', 'dep.id', '=', 'emp.id_department')//employments a departments
            ->join('companies as comp', 'comp.id','=','dep.id_company')//departments a companies
            ->join('user_categories as usrcat','usrcat.id','=','usr.id_user_category')//users a user_categories
            ->where('usr.id', '<>', $request->input('id'))
            ->where('comp.id', '=', $request->input('id_company'))
            ->select('usr.id','usr.name','usr.email','usr.last_name',
                     'usr.status','dep.department','usrcat.category as user_category')
            ->get();
         return response()->json($users);

        } catch (\Throwable $th) {
            $response = [
                "status" => 400,
                "result" => "Error"
            ];
            return response()->json($response);
        }
        
    }

      /********************************************************************* */
      //Query para listar a los empleados segun su departamento
      public function users_by_department($id){
        try {
            $users = DB::table('users as usr')
            ->join('employments as emp', 'emp.id', '=', 'usr.id_employment')//users a employments
            ->join('departments as dep', 'dep.id', '=', 'emp.id_department')//employments a departments
            ->where( [
                    ['usr.status', '=', 1],
                    ['dep.id', '=', $id ]
                ])
            ->select('usr.id','usr.name','usr.last_name','usr.id_employment', 
            'dep.id as id_department')
            ->get();
         return response()->json($users);
         
        } catch (\Throwable $th) {
            $response = [
                "status" => 400,
                "result" => "Error"
            ];
            return response()->json($response);
        }
        
    }

      /********************************************************************* */
      //Query para listar a los empleados de una empresa que aún NO son 
      //evaluadores/creadores/evaluados de una evaluación
      //específica
      public function arent_evaluators($id_evaluation , $id_company){
        try {
            //Query para obtener miembros de la misma empresa a la que pertenece el evaluado
            $members = DB::table('users as usr')
            ->join('employments as emp', 'emp.id', '=', 'usr.id_employment')//users a employments
            ->join('departments as dep', 'dep.id', '=', 'emp.id_department')//employments a departments
            ->join('companies as comp', 'comp.id', '=', 'dep.id_company')//departments a companies
            ->where([
                ['comp.id','=',$id_company],
                ['usr.id_user_category','<>',1],
            ])
            ->select('usr.id','usr.name','usr.last_name','emp.employment')
            ->get();

            //Query para obtener a los usuarios que ya estan asignados a la evaluación 
            $evaluators = DB::table('users as usr')
            ->join('evaluators as evt', 'evt.id_user', '=', 'usr.id')//users a evaluators
            ->where([
                ['evt.id_evaluation','=',$id_evaluation],
            ])
            ->select('usr.id')
            ->get();

             /******** */

            //convertiendo arreglo $members en un json string
            $membersObjS =json_encode($members);
            //convirtiendo json string en json object
            $membersObj=json_decode($membersObjS,true);
            $users=[]; //Arreglo que almacena el id de los usuarios de la empresa
            //convertiendo arreglo $evaluators en un json string
            $evaluatorsObjS =json_encode($evaluators);
            //convirtiendo json string en json object
            $evaluatorsObj=json_decode($evaluatorsObjS,true);
            $evaluatorsId=[]; //Arreglo que almacena el id de los usuarios ya asignados
            
            /********* */
            //Obtenemos los id de $evaluators sin la key
            foreach($evaluatorsObj as $key =>$value){
                array_push($evaluatorsId,$value['id']);
            }

         //Recorremos el arreglo de miembros para verificar si ya estan asignados a la evaluacion
            foreach ( $membersObj as $key=>$value) {
                //Se decartan a los miembros ya asignados
                if (!in_array($value['id'], $evaluatorsId)) { //in_array será true si coincide un dato en el arreglo
                    array_push($users,$value);
                }
            }
         return response()->json($users);
         
        } catch (\Throwable $th) {
            $response = [
                "status" => 400,
                "result" => "Error",
                "response"=>$users
            ];
            return response()->json($response);
        }
        
    }

            /********************************************************************* */
            //Query para obtener los datos de sesión para usuarios autenticados
    public function getuserData(Request $request){
        //buscamos los datos del usuario que coincida con el email ingresado
                   try {
                    $users = DB::table('users as usr')
                    ->join('employments as emp', 'emp.id', '=', 'usr.id_employment')//users a employments
                    ->join('departments as dep', 'dep.id', '=', 'emp.id_department')//employments a departments
                    ->join('companies as comp', 'comp.id', '=', 'dep.id_company')//departments a companies
                    ->where('usr.email', '=', $request->input('email'))
                    ->select('usr.id','usr.name','usr.last_name','usr.id_user_category', 'usr.status',
                    'comp.id as id_company','comp.status as company_status')
                    ->get();
                
                        //retornamos el objeto con los datos del usuario si es que existe
                 return response()->json($users);
                    } catch (\Throwable $th) {
                        //en caso de que no exista el correo
                        $response = [
                            "status" => 401,
                            "details" => "Email not found"
                        ];
                        return response()->json($response);
                        
                    }
        }

   
}

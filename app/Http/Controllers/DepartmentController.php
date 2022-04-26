<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Department;
use DB;
class DepartmentController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $department = Department::all();
                //retornando json para frontend
         return response()->json($department);
            } catch (\Throwable $th) {
                throw $th;
            }
     
    }

            /********************************************************************* */
    public function store(Request $request)
    {
        
        //creando obj del modelo Department para guardar nuevo registro
        $department = new Department();
 
        //asignando datos del request al objeto
        $department->department = $request->input('department');
        $department->description = $request->input('description');
        $department->id_company = $request->input('id_company');

        //guardando department
        try {
            $department->save();
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
        $department = Department::select('*')
            ->where('id', '=', $id)
            ->get();
         return response()->json($department);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

               /********************************************************************* */
    public function update(Request $request, $id)
    {
        //seleccionando registro segun id para modifircarlo
        $department = Department::find($id);
    
        //asignando datos del request al objeto
        $department->department = $request->input('department');
        $department->description = $request->input('description');
        $department->id_company = $request->input('id_company');

        //guardando cambios en el registro
        try {
            $department->save();
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
        if($id!=1){
        //buscando registro por id
        $department = Department::find($id);
        try {
            $department->delete();
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
            'result' =>'NO',
        ];
    }
        return response()->json($result);
    }
     /********************************************************************* */
   //Metodo para listar departamentos segun la empresa
   public function list_by_company($id)
   {
     
       try { 
           $department = DB::table('departments as dep')
           ->join('companies as comp','comp.id','=','dep.id_company')
           ->where('comp.id', '=', $id)
           ->select('dep.*')
           ->get();
           
        return response()->json($department);
       } catch (\Throwable $th) {
           throw $th;
       }
   }

}

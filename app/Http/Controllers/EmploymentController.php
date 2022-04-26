<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employment;
use DB;
class EmploymentController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
        try { 
            $employment = DB::table('employments as emp')
            ->join('departments as dep', 'dep.id', '=', 'emp.id_department')
            ->select('emp.*','dep.department')
            ->orderBy('dep.department', 'asc')
            ->get();
            
         return response()->json($employment);
        } catch (\Throwable $th) {
            throw $th;
        }
     
    }

            /********************************************************************* */
    public function store(Request $request)
    {
        
        //creando obj del modelo Employment para guardar nuevo registro
        $employment = new Employment();
 
        //asignando datos del request al objeto
        $employment->employment = $request->input('employment');
        $employment->description = $request->input('description');
        $employment->id_department = $request->input('id_department');
        
        //guardando employment
        try {
            $employment->save();
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
            $employment = DB::table('employments as emp')
            ->join('departments as dep', 'dep.id', '=', 'emp.id_department')
            ->where('emp.id', '=', $id)
            ->select('emp.*','dep.department as department')
            ->get();
            
         return response()->json($employment);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

               /********************************************************************* */
    public function update(Request $request, $id)
    {
        //seleccionando registro segun id para modifircarlo
        $employment = Employment::find($id);
    
        //asignando datos del request al objeto
        $employment->employment = $request->input('employment');
        $employment->description = $request->input('description');
        $employment->id_department = $request->input('id_department');

        //guardando cambios en el registro
        try {
            $employment->save();
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
        $employment = Employment::find($id);
        try {
            $employment->delete();
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
   //Metodo para listar cargos segun la empresa
   public function list_by_company($id)
   {
     
       try { 
           $employment = DB::table('employments as emp')
           ->join('departments as dep', 'dep.id', '=', 'emp.id_department')
           ->join('companies as comp','comp.id','=','dep.id_company')
           ->where('comp.id', '=', $id)
           ->orderby('dep.department')
           ->select('emp.*','dep.department as department')
           ->get();
           
        return response()->json($employment);
       } catch (\Throwable $th) {
           throw $th;
       }
   }

        /********************************************************************* */
   //Metodo para listar cargos segun el departamento
   public function list_by_department($id)
   {
     
       try { 
           $employment = DB::table('employments as emp')
           ->join('departments as dep', 'dep.id', '=', 'emp.id_department')
           ->where('dep.id', '=', $id)
           ->orderby('emp.employment')
           ->select('emp.*')
           ->get();
           
        return response()->json($employment);
       } catch (\Throwable $th) {
           throw $th;
       }
   }
}

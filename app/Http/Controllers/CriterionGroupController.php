<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CriterionGroup;
use DB;
class CriterionGroupController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $critgroup = DB::table('criteria_groups as critgroup')
                ->join('calculation_algorithms as alg','alg.id','=','critgroup.algorithm')
                ->select('critgroup.*','alg.title as alg_title')
                ->get();
                //retornando json para frontend
         return response()->json($critgroup);
            } catch (\Throwable $th) {
                throw $th;
            }
     
    }

            /********************************************************************* */
    public function store(Request $request)
    {
        
        //creando obj del modelo CriterionGroup para guardar nuevo registro
        $critgroup = new CriterionGroup();
 
        //asignando datos del request al objeto
        $critgroup->title = $request->input('title');
        $critgroup->description = $request->input('description');
        $critgroup->algorithm = $request->input('algorithm');
        
        //guardando critgroup
        try {
            $critgroup->save();
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
        $critgroup = CriterionGroup::select('*')
            ->where('id', '=', $id)
            ->get();
         return response()->json($critgroup);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

               /********************************************************************* */
    public function update(Request $request, $id)
    {
        //seleccionando registro segun id para modifircarlo
        $critgroup = CriterionGroup::find($id);
    
        //asignando datos del request al objeto
         $critgroup->title = $request->input('title');
        $critgroup->description = $request->input('description');
        $critgroup->algorithm = $request->input('algorithm');

        //guardando cambios en el registro
        try {
            $critgroup->save();
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
        $critgroup = CriterionGroup::find($id);
        try {
            $critgroup->delete();
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

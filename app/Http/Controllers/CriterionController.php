<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Criterion;
use DB;
class CriterionController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $criterion = Criterion::all();
                //retornando json para frontend
         return response()->json($criterion);
            } catch (\Throwable $th) {
                throw $th;
            }
     
    }

            /********************************************************************* */
    public function store(Request $request)
    {
        try {
        $sum = DB::table('criteria as crit')
        ->join('criteria_groups as critgroup','critgroup.id','=','crit.group')
        ->where('crit.group', '=',$request->input('group'))
        ->select(DB::raw('SUM(crit.percentage) as percentage_sum '))
        ->get();
        //Porcentage proveniente del formulario
        $percentage = $request->input('percentage');
        //Suma de porcentajes actuales del grupo de criterios
        $actual_percentage = $sum[0]->percentage_sum;

            if(($actual_percentage+$percentage)<=100){
                //creando obj del modelo Criterion para guardar nuevo registro
                $criterion = new Criterion();
                //asignando datos del request al objeto
                $criterion->criterion = $request->input('criterion');
                $criterion->description = $request->input('description');
                $criterion->percentage = $request->input('percentage');
                $criterion->group = $request->input('group');
                //guardando criterion
                $criterion->save();

                    $result=[
                        'status'=>200,
                        'result' => 'OK',
                        'response'=>$actual_percentage
                    ];
            }else{
                $result=[
                    'status'=>401,
                    'result' => 'NO'
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
        $criterion = Criterion::select('*')
            ->where('id', '=', $id)
            ->get();
         return response()->json($criterion);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

               /********************************************************************* */
    public function update(Request $request, $id)
    {
        //seleccionando registro segun id para modifircarlo
        $criterion = Criterion::find($id);
    
        //asignando datos del request al objeto
        $criterion->criterion = $request->input('criterion');
        $criterion->description = $request->input('description');
        $criterion->percentage = $request->input('percentage');
        $criterion->group = $request->input('group');

        //guardando cambios en el registro
        try {
            $criterion->save();
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
        $criterion = Criterion::find($id);
        try {
            $criterion->delete();
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
   public function criteria_by_group($id){
    try { 
        $criteria = DB::table('criteria as crit')
        ->join('criteria_groups as critgroup','critgroup.id','=','crit.group')
        ->where('critgroup.id', '=', $id)
        ->select('crit.*')
        ->get();
        
     return response()->json($criteria);
    } catch (\Throwable $th) {
        throw $th;
    }
   }

}

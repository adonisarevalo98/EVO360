<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Evaluation_Item;
class EvaluationItemController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $evaluation_item = Evaluation_Item::all();
                //retornando json para frontend
         return response()->json($evaluation_item);
            } catch (\Throwable $th) {
                throw $th;
            }
     
    }

            /********************************************************************* */
    public function store(Request $request)
    {
         //obtenemos la lista de usuarios (asignado y creador) 
      $evaItems= $request->input('items');

      try {
          //Recorremos la lista e insertamos los items en la tabla
          //Si comparamos con el objeto enviado desde angular $evaItems es el objeto items,
          //$key serán las columnas del arreglo items de la plantilla; $value seran los datos .  
    foreach($evaItems as $key => $value){
         //creando obj del modelo Evaluator para guardar nuevo registro
         //el objeto debe ser creado dentro del loop ya que no puede ser reescrito fuera de él
         $evaluation_item = new Evaluation_Item();
        //obtenemos el id de la evaluación para asignarle los usuarios
       $evaluation_item->id_evaluation = $request->input('id_evaluation');
        //asignando datos del request al objeto
        $evaluation_item->id_item = $value['id'];
     //guardando usuarios
     $evaluation_item->save(); 
    }
         $result=[
            'status'=>200,
            'result' => 'OK',
            'response'=>$evaItems
        ];
    } catch (\Throwable $th) {
        $result=[
            'status'=>400,
            'result' => 'ERROR',
            'response' => 'Set items Fail',
        ];
    }  

    return response()->json($result);
       
    }

        /********************************************************************* */
   //Metodo para selección de departamento segun su ID
    public function show($id)
    {
      
        try { 
        $evaluation_item = Evaluation_Item::select('*')
            ->where('id', '=', $id)
            ->get();
         return response()->json($evaluation_item);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

               /********************************************************************* */
    public function update(Request $request, $id)
    {
        //seleccionando registro segun id para modifircarlo
        $evaluation_item = Evaluation_Item::find($id);
    
        //asignando datos del request al objeto
        $evaluation_item->id_evaluation = $request->input('id_evaluation');
        $evaluation_item->id_item = $request->input('id_item');

        //guardando cambios en el registro
        try {
            $evaluation_item->save();
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
        $evaluation_item = Evaluation_Item::find($id);
        try {
            $evaluation_item->delete();
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

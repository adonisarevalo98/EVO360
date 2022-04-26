<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rating;
use DB;
class RatingController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $rating = Rating::all();
                //retornando json para frontend
         return response()->json($rating);
            } catch (\Throwable $th) {
                throw $th;
            }
     
    }

            /********************************************************************* */
    public function store(Request $request)
    {
        
        //creando obj del modelo Rating para guardar nuevo registro
        $rating = new Rating();
 
        //asignando datos del request al objeto
        $rating->description = $request->input('description');
        $rating->value = $request->input('value');
        $rating->rating_type = $request->input('id_rating_type');
        
        //guardando rating
        try {
            $rating->save();
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
        $rating = Rating::select('*')
            ->where('id', '=', $id)
            ->get();
         return response()->json($rating);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

               /********************************************************************* */
    public function update(Request $request, $id)
    {
        //seleccionando registro segun id para modifircarlo
        $rating = Rating::find($id);
    
        //asignando datos del request al objeto
        $rating->description = $request->input('description');
        $rating->value = $request->input('value');
        $rating->rating_type = $request->input('id_rating_type');

        //guardando cambios en el registro
        try {
            $rating->save();
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
        $rating = Rating::find($id);
        try {
            $rating->delete();
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

      //Lista de items por evaluación y puntuaciones por item
        public function ratings_by_evaluation($id) {
         try { 
                   //Query para obtener los items y criterios de una evaluacion
             $items = DB::table('items as item')
          ->join('evaluations_items as evaite','evaite.id_item','=','item.id')// items a evaluation_items
          ->join('evaluations as eva','eva.id','=','evaite.id_evaluation')//evaluation_items a evaluations
          ->join('criteria as crit','crit.id','=','item.id_criterion','left')//items a criteria
          ->select('item.id','item.question','item.id_criterion','crit.group','evaite.id as id_evaitem')
          ->where('eva.id','=',$id)  //Recoge items con criterio 
          ->orWhere([                //Recoge items sin criterio
              ['eva.id','=',$id],
              ['item.id_criterion','=',null]
              ])
          ->orderBy('item.id')
          ->get();

            /******** */
            //convertiendo arreglo $items en un json string
            $itemsObjS =json_encode($items);
            //convirtiendo json string en json object
            $itemsObj=json_decode($itemsObjS,true);
             /******** */

            /******** */
            $ratings_items=[]; //Arreglo que almacena como argumento cada item y
                               //dentro de cada item el arreglo con sus ratings
            /********* */

            //Recorremos al objeto que almacena los items
            $i=0;
            foreach($itemsObj as $key =>$value){
                //Con este query obtenemos el arreglo de ratings que pertenecen a un solo item
                $rating = DB::table('ratings as rat')
          ->join('rating_types as raty', 'raty.id', '=', 'rat.id_rating_type') // ratings a rating_types
          ->join('items as item','item.id_rating_type','=','raty.id')// rating_types a items
          ->where('item.id', '=', $value['id'])
          ->select('rat.description','rat.value')
          ->orderBy('rat.value')
          ->get();
          //Almacenamos en el arreglo cada argumento
                  $ratings_items[$i]=array(
                      'id_evaitem'=>$value['id_evaitem'], //Id del item
                      'question'=>$value['question'],   //Pregunta del item
                      'id_criterion'=>$value['id_criterion'], //Criterio de evaluación del item
                      'criteria_group'=>$value['group'],
                      'ratings'=>$rating
                            
                      
                     
                    );
                $i++;
            }
         return response()->json($ratings_items);
         } catch (\Throwable $th) {
            throw $th;
             }
         }       
}

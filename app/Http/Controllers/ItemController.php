<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use DB;
class ItemController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $item = Item::all();
                //retornando json para frontend
         return response()->json($item);
            } catch (\Throwable $th) {
                throw $th;
            }
     
    }

            /********************************************************************* */
    public function store(Request $request)
    {
        
        //creando obj del modelo Item para guardar nuevo registro
        $item = new Item();
 
        //asignando datos del request al objeto
        $item->question = $request->input('question');
        $item->question_origin = $request->input('question_origin');
        $item->question_type = $request->input('question_type');
        $item->comment = $request->input('comment');
        $item->id_template = $request->input('id_template');
        $item->id_rating_type = $request->input('id_rating_type');
        $item->id_criterion = $request->input('id_criterion');
        
        //guardando item
        try {
            $item->save();
            $result=[
                'status'=>200,
                'result' => 'OK',
            ];
        } catch (\Throwable $th) {
            $result=[
                'status'=>400,
                'result' => 'ERROR',
                'respones'=>$item
            ];
        }
       
        return response()->json($result);
       
    }

        /********************************************************************* */
   //Metodo para selección de departamento segun su ID
    public function show($id)
    {
      
        try { 
        $item = Item::select('*')
            ->where('id', '=', $id)
            ->get();
         return response()->json($item);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

               /********************************************************************* */
    public function update(Request $request, $id)
    {
        //seleccionando registro segun id para modifircarlo
        $item = Item::find($id);
    
        //asignando datos del request al objeto
        $item->question = $request->input('question');
        $item->question_origin = $request->input('question_origin');
        $item->question_type = $request->input('question_type');
        $item->comment = $request->input('comment');
        $item->id_template = $request->input('id_template');
        $item->id_rating_type = $request->input('id_rating_type');
        $item->id_criterion = $request->input('id_criterion');

        //guardando cambios en el registro
        try {
            $item->save();
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
        $item = Item::find($id);
        try {
            $item->delete();
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

             //Lista de items que pertenecen a un template segun su id
        public function list_by_template($id)
    {
        try { 
            $item = DB::table('items as item')
            ->join('question_templates as template', 'template.id', '=', 'item.id_template') // items a question_templates
            ->join('rating_types as ra_type', 'ra_type.id', '=', 'item.id_rating_type')//items a rating_types
            ->join('criteria as crit','crit.id','=','item.id_criterion','left')//items a criteria
            ->where('item.id_template', '=', $id)
            ->orWhere([
                ['item.id_template', '=', $id],
                ['item.id_criterion', '=', null]])
            ->select('item.*','template.type','ra_type.type','crit.criterion')
            ->orderBy('item.id')
            ->get();
         return response()->json($item);
        
        } catch (\Throwable $th) {
            throw $th;
        }
    }       

}

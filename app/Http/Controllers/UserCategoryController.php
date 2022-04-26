<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User_Category;
class UserCategoryController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $user_category = User_Category::all();
                //retornando json para frontend
         return response()->json($user_category);
            } catch (\Throwable $th) {
                throw $th;
            }
     
    }

            /********************************************************************* */
    public function store(Request $request)
    {
        
        //creando obj del modelo User_Category para guardar nuevo registro
        $user_category = new User_Category();
 
        //asignando datos del request al objeto
        $user_category->category = $request->input('category');
        
        //guardando user_category
        try {
            $user_category->save();
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
        $user_category = User_Category::select('*')
            ->where('id', '=', $id)
            ->get();
         return response()->json($user_category);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

               /********************************************************************* */
    public function update(Request $request, $id)
    {
        //seleccionando registro segun id para modifircarlo
        $user_category = User_Category::find($id);
    
        //asignando datos del request al objeto
        $user_category->category = $request->input('category');

        //guardando cambios en el registro
        try {
            $user_category->save();
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
        $user_category = User_Category::find($id);
        try {
            $user_category->delete();
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

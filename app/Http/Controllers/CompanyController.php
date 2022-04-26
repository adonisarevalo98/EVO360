<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company;

class CompanyController extends Controller
{
    public function index()
    {
        //seleccionando todos los registros de la tabla por medio del modelo
    
            try {
                $company = Company::all();
                //retornando json para frontend
         return response()->json($company);
            } catch (\Throwable $th) {
                throw $th;
            }
     
    }

            /********************************************************************* */
    public function store(Request $request)
    {
        
        //creando obj del modelo Company para guardar nuevo registro
        $company = new Company();
        //asignando datos del request al objeto
        $company->company = $request->input('company');
        $company->logo = $request->input('logo');
        $company->status = $request->input('status');

        
        //guardando company
        try {
            $company->save();
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
        $company = Company::select('*')
            ->where('id', '=', $id)
            ->get();
         return response()->json($company);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

               /********************************************************************* */
    public function update(Request $request, $id)
    {
        //seleccionando registro segun id para modifircarlo
        $company = Company::find($id);
    
        //asignando datos del request al objeto
        $company->company = $request->input('company');
        $company->logo = $request->input('logo');
        $company->status = $request->input('status');

        //guardando cambios en el registro
        try {
            $company->save();
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
        $company = Company::find($id);
        try {
            
            $company->delete();
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

}

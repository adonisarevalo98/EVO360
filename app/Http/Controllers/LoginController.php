<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\Controller;
//use App\Http\Requests\SignUpRequest;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    use Notifiable, HasApiTokens;

  /******************************** LOG IN ***************************/

    public function validate_users(Request $request){//Query para validar usuarios
        if  (!Auth::attempt($request->only('email','password'))){
            return response()->json([
              'status'=>401,
              'message' => 'email o contraseña invalida',
            ], 401);
        }
        $user = User::where('email',$request['email'])->firstOrFail();
        $token  = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
          'status'=>200,
          'access_token' => $token,
          'token_type' => 'Bearer',
        ], 200);

        
    }

  
  /******************************** LOG OUT ***************************/
    public function logout(Request $request){
      try {
        $user = User::where('email',$request['email'])->firstOrFail();
        // Revoke all tokens...
         if( $user->tokens()->delete()){
          $response = [
            'status'=>true,
            'message'=>'Logout successfully',
        ];
         }
         return response($response,201);
    } catch (\Throwable $th) {
     //   throw $th;
     $response = [
      'status'=>false,
      'message'=>'Logout failed',
  ];
  return response($response,201);
    }
      
    }



  /******************************** SIGN UP ***************************/
    //la url estará desactivada por defecto
    public function register(Request $request){
      
        $validateData = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
            'id_user_category' => 'required|integer',
            'status' => 'required|integer'
        ]);
        $user = User::create([
            'name' => $validateData['name'],
            'last_name' => $validateData['last_name'],
            'email' => $validateData['email'],
            'password' => $validateData['password'],
            'avatar' => $request->input('avatar'),
            'id_user_category' => $validateData['id_user_category'],
            'id_employment' => $request->input('id_employment'),
            'status' => $validateData['status']
        ]);
        $token  = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
          'status'=>200,
          'access_token' => $token,
          'token_type' => 'Bearer',
        ], 200);

  

    }
}

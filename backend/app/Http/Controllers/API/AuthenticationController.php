<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\API\User as UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthenticationController extends Controller
{
    /**
     * @param Request $request
     * @return Response
     */
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);
        if ($validator->fails()) {
            return response(null, 422);
        }

        User::create([
            'username' => $request->get('email'),
            'email' => $request->get('email'),
            'password' => $request->get('password')
        ]);

        return response(null, 201);
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function login(Request $request) {
        $credentials = $request->only('email', 'password');

        $validator = Validator::make($credentials, [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string']
        ]);
        if ($validator->fails()) {
            return response(null, 422);
        }

        if (Auth::attempt($credentials)) {

            $user = Auth::user();
            $access_token = $user->createToken('Login User')->accessToken;
            return response()->json(array(
                "user" => new UserResource($user),
                "access_token" => $access_token
            ), 200);
        }

        return response(null, 401);
    }
}

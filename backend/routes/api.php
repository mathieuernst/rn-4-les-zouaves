<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/users/me', function (Request $request) {
    $user = $request->user();

    return response()->json(new \App\Http\Resources\API\User($user), 200);
});

Route::group([
    'namespace' => 'API',
    'middleware' => 'api'
], function (){
    Route::post('register', [ 'as' => 'authentication.register', 'uses' => 'AuthenticationController@register']);
    Route::post('login', [ 'as' => 'authentication.login', 'uses' => 'AuthenticationController@login']);

    Route::middleware('auth:api')->post('firebases', [ 'as' => 'firebases.store', 'uses' => 'FirebaseController@store']);
    Route::middleware('auth:api')->post('firebases/sendNotifications', [ 'as' => 'firebases.sendNotifications', 'uses' => 'FirebaseController@sendNotifications']);
    Route::middleware('auth:api')->resource('users', 'UserController', ['only' => ['index', 'store', 'show', 'update', 'destroy']]);
});

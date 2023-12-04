<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/login', function (Request $request) {
    return response(__('response.failed.unauthorized', ['name' => "data"]), 401);
})->name('login');

// main api v1
Route::prefix('v1')->group(function (): void {
    require 'v1/auth.api.php';
    require 'v1/news.api.php';
});
require 'v1/utils.api.php';

// address undefined routes
Route::get('/{path?}', function () {
    return response()->json(['message' => __('response.warning.notfound', ['name' => 'route'])]);
})->where('path', '.*');

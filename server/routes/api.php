<?php

use App\Http\Controllers\Calculations\BEPController;
use App\Http\Controllers\Calculations\BranchController;
use App\Http\Controllers\Calculations\BSController;
use App\Http\Controllers\Calculations\PLController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/get/bs', [BSController::class, 'queryBS'])->name('bs.get');
Route::get('/get/pl', [PLController::class, 'queryPL'])->name('pl.get');
Route::get('/get/branch', [BranchController::class, 'queryBranch'])->name('branch.get');
Route::get('/get/bep', [BEPController::class, 'queryBEP'])->name('bep.get');

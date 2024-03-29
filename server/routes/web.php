<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BSController;
use App\Http\Controllers\SSO\SSOController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect(route('sso.login'));
});
Route::get('/home', function () {
    return view('welcome');
})->name('home');
Route::get('/get_bs', [BSController::class, 'queryBS'])->name('bs.view');
Route::get('/get_pl', [PLController::class, 'queryPL'])->name('pl.view');

Route::get("/sso/login", [SSOController::class, 'getLogin'])->name('sso.login');
Route::get("/callback", [SSOController::class, 'getCallback'])->name('sso.callback');
Route::get("/sso/connect", [SSOController::class, 'connectUser'])->name('sso.connect');
Route::get("/logged_in", [SSOController::class, 'loggedIn']);

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            return route('login');
        }
    }
    public function handle($request, Closure $next, ...$guards)
    {   
        $user = Auth::user();
        //check if client is logged in
        if(!$user) return redirect('/login');

        //check if host is logged in
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            "Authorization" => "Bearer " . session()->get("access_token"),
        ])->post(config('auth.sso_host') . "/api/checkUser",[
            'email' => $user->email,
        ]);
        //die($response);
        if($response->json()!=1){
            //doesn't logout SSO
            Auth::logout();
            return redirect('/login');
        }

        $this->authenticate($request, $guards);
        
        return $next($request);
    }
}

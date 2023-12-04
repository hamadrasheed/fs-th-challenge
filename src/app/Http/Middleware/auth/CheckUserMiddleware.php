<?php

namespace App\Http\Middleware\auth;

use App\Traits\apiResponseTrait;
use Closure;
use Illuminate\Http\Request;

class CheckUserMiddleware
{
    use apiResponseTrait;
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if (!$user->is_active || !$user->email_verified_at)
            return !$user->email_verified_at ? $this->responseWaitingEmailConfirm() : $this->responseInactive();

        return $next($request);
    }
}

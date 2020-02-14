<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Factory as Auth;
use Illuminate\Http\Request;

class Authenticate
{
    /**
     * The authentication factory instance.
     *
     * @var Auth
     */
    protected $auth;

    /**
     * Create a new middleware instance.
     *
     * @param Auth $auth
     * @return void
     */
    public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param  Request  $request
     * @param Closure $next
     * @param  string[]  ...$guards
     * @return mixed
     *
     */
    public function handle($request, Closure $next, ...$guards)
    {
        $this->authenticate($guards);

        if ($this->auth == null) {
            return response(null, 401);
        }

        return $next($request);
    }

    /**
     * @param array $guards
     * @return void
     */
    protected function authenticate(array $guards)
    {
        if (empty($guards)) {
            $guards = [null];
        }

        foreach ($guards as $guard) {
            if ($this->auth->guard($guard)->check()) {
                return $this->auth->shouldUse($guard);
            }
        }

        $this->unauthenticated();
    }

    /**
     * Handle an unauthenticated user.
     *
     * @return void
     */
    protected function unauthenticated()
    {
        $this->auth = null;
    }
}



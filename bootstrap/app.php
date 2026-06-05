<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

use App\Http\Middleware\IsAdmin;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            
            // TAMBAHKAN BARIS INI: Middleware untuk mengaktifkan logoutOtherDevices
            \Illuminate\Session\Middleware\AuthenticateSession::class,
        ]);

        $middleware->alias([
            'admin' => IsAdmin::class,
        ]);

        // 🔥 PERBAIKAN: Menggunakan wildcard 'api/*' agar mencakup rute web yang menggunakan prefix api
                $middleware->validateCsrfTokens(except: [
            'api/midtrans-callback', 
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
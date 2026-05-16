<?php

use App\Http\Controllers\PaymentCallbackController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route bawaan Laravel 11 (Biarkan saja)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// 🔥 ROUTE CALLBACK MIDTRANS 
Route::post('/midtrans/callback', [PaymentCallbackController::class, 'handleNotification']);
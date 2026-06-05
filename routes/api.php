<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route bawaan Laravel 11 (Biarkan default seperti ini)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
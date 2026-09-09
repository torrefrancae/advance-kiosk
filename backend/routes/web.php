<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['ok' => true, 'hint' => 'advance-kiosk coming soon']);
});

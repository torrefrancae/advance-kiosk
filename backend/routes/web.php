<?php

use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\OrderController;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

Route::prefix('sample/advance-kiosk/api')->group(function () {
    Route::get('/health', function () {
        return response()->json([
            'ok' => true,
            'service' => 'advance-kiosk',
            'brand' => 'BeeJoy',
        ]);
    });
    Route::get('/menu', [MenuController::class, 'index']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/stream', [OrderController::class, 'stream']);
    Route::patch('/orders/{order}', [OrderController::class, 'update']);
});

$dist = public_path('kiosk-dist');

Route::get('/sample/advance-kiosk/assets/{path}', function (string $path) use ($dist) {
    $full = $dist.DIRECTORY_SEPARATOR.'assets'.DIRECTORY_SEPARATOR.str_replace(['..', '\\'], '', $path);
    abort_unless(is_file($full), 404);

    return response()->file($full);
})->where('path', '.*');

Route::get('/sample/advance-kiosk/{any?}', function () use ($dist) {
    $index = $dist.DIRECTORY_SEPARATOR.'index.html';
    abort_unless(is_file($index), 404, 'Kiosk UI not built yet. Run npm run build in client/.');

    return response(File::get($index), 200, [
        'Content-Type' => 'text/html; charset=UTF-8',
        'Cache-Control' => 'no-cache',
    ]);
})->where('any', '^(?!api(?:/|$)|assets(?:/|$)).*');

Route::get('/', function () {
    return redirect('/sample/advance-kiosk/');
});

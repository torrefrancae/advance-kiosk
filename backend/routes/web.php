<?php

use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\OrderController;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

$prefix = trim((string) env('KIOSK_URL_PREFIX', 'sample/advance-kiosk'), '/');
$dist = public_path('kiosk-dist');

$register = function (string $base) use ($dist) {
    $api = ($base === '' ? 'api' : $base.'/api');
    $assets = ($base === '' ? 'assets' : $base.'/assets');
    $menu = ($base === '' ? 'menu' : $base.'/menu');
    $spa = ($base === '' ? '{any?}' : $base.'/{any?}');

    Route::prefix($api)->group(function () {
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

    Route::get($assets.'/{path}', function (string $path) use ($dist) {
        $safe = str_replace(['..', '\\'], '', $path);
        $full = $dist.DIRECTORY_SEPARATOR.'assets'.DIRECTORY_SEPARATOR.$safe;
        abort_unless(is_file($full), 404);

        $mime = match (true) {
            str_ends_with($safe, '.css') => 'text/css; charset=UTF-8',
            str_ends_with($safe, '.js') => 'text/javascript; charset=UTF-8',
            str_ends_with($safe, '.mjs') => 'text/javascript; charset=UTF-8',
            str_ends_with($safe, '.svg') => 'image/svg+xml',
            str_ends_with($safe, '.png') => 'image/png',
            str_ends_with($safe, '.jpg'), str_ends_with($safe, '.jpeg') => 'image/jpeg',
            str_ends_with($safe, '.woff2') => 'font/woff2',
            str_ends_with($safe, '.woff') => 'font/woff',
            default => 'application/octet-stream',
        };

        return response()->file($full, [
            'Content-Type' => $mime,
            'Cache-Control' => 'public, max-age=3600',
        ]);
    })->where('path', '.*');

    Route::get($menu.'/{path}', function (string $path) use ($dist) {
        $safe = str_replace(['..', '\\'], '', $path);
        $full = $dist.DIRECTORY_SEPARATOR.'menu'.DIRECTORY_SEPARATOR.$safe;
        abort_unless(is_file($full), 404);

        return response()->file($full, [
            'Content-Type' => 'image/svg+xml',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    })->where('path', '.*');

    Route::get($spa, function () use ($dist) {
        $index = $dist.DIRECTORY_SEPARATOR.'index.html';
        abort_unless(is_file($index), 404, 'Kiosk UI not built yet. Run npm run build in client/.');

        return response(File::get($index), 200, [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Cache-Control' => 'no-cache',
        ]);
    })->where('any', '^(?!api(?:/|$)|assets(?:/|$)|menu(?:/|$)).*');
};

$register($prefix);

if ($prefix !== '') {
    Route::get('/', function () use ($prefix) {
        return redirect('/'.$prefix.'/');
    });
}

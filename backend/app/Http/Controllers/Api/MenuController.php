<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\MenuCatalog;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'ok' => true,
            'brand' => 'BeeJoy',
            'currency' => 'PHP',
            'items' => MenuCatalog::all(),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Support\MenuCatalog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OrderController extends Controller
{
    private const ACTIVE = ['queued', 'paid', 'preparing', 'ready'];

    public function index(Request $request): JsonResponse
    {
        $query = Order::query()->orderByDesc('id');

        if ($request->boolean('active', true)) {
            $query->whereIn('status', self::ACTIVE);
        }

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        $orders = $query->limit(80)->get()->map(fn (Order $order) => $this->present($order));

        return response()->json([
            'ok' => true,
            'orders' => $orders,
            'server_time' => now()->toIso8601String(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'customer_name' => ['nullable', 'string', 'max:80'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'string'],
            'items.*.qty' => ['required', 'integer', 'min:1', 'max:20'],
            'source' => ['nullable', 'string', 'max:32'],
        ]);

        try {
            $built = MenuCatalog::buildLines($data['items']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 422);
        }

        $order = Order::create([
            'code' => $this->nextCode(),
            'customer_name' => trim((string) ($data['customer_name'] ?? 'Guest')) ?: 'Guest',
            'status' => 'queued',
            'items' => $built['lines'],
            'total_cents' => $built['total_cents'],
            'source' => $data['source'] ?? 'kiosk',
        ]);

        return response()->json([
            'ok' => true,
            'order' => $this->present($order),
        ], 201);
    }

    public function update(Request $request, Order $order): JsonResponse
    {
        $data = $request->validate([
            'status' => ['nullable', 'string', 'in:queued,paid,preparing,ready,completed'],
            'customer_name' => ['nullable', 'string', 'max:80'],
            'items' => ['nullable', 'array', 'min:1'],
            'items.*.id' => ['required_with:items', 'string'],
            'items.*.qty' => ['required_with:items', 'integer', 'min:1', 'max:20'],
        ]);

        if (isset($data['items'])) {
            if (! in_array($order->status, ['queued', 'paid'], true)) {
                return response()->json([
                    'ok' => false,
                    'error' => 'Only unpaid or paid tickets can still be edited.',
                ], 422);
            }
            try {
                $built = MenuCatalog::buildLines($data['items']);
            } catch (\InvalidArgumentException $e) {
                return response()->json(['ok' => false, 'error' => $e->getMessage()], 422);
            }
            $order->items = $built['lines'];
            $order->total_cents = $built['total_cents'];
        }

        if (array_key_exists('customer_name', $data) && $data['customer_name'] !== null) {
            $order->customer_name = trim((string) $data['customer_name']) ?: 'Guest';
        }

        if (! empty($data['status'])) {
            $next = $data['status'];
            $order->status = $next;

            if ($next === 'paid' && ! $order->paid_at) {
                $order->paid_at = now();
            }
            if ($next === 'preparing' && ! $order->preparing_at) {
                $order->preparing_at = now();
                if (! $order->paid_at) {
                    $order->paid_at = now();
                }
            }
            if ($next === 'ready' && ! $order->ready_at) {
                $order->ready_at = now();
                if (! $order->preparing_at) {
                    $order->preparing_at = now();
                }
                if (! $order->paid_at) {
                    $order->paid_at = now();
                }
            }
            if ($next === 'completed') {
                $order->completed_at = now();
                if (! $order->ready_at) {
                    $order->ready_at = now();
                }
                if (! $order->paid_at) {
                    $order->paid_at = now();
                }
            }
        }

        $order->save();

        return response()->json([
            'ok' => true,
            'order' => $this->present($order->fresh()),
        ]);
    }

    public function stream(): StreamedResponse
    {
        return response()->stream(function () {
            $lastHash = '';
            $ticks = 0;
            while ($ticks < 45 && connection_aborted() === 0) {
                $payload = [
                    'ok' => true,
                    'orders' => Order::query()
                        ->whereIn('status', self::ACTIVE)
                        ->orderBy('id')
                        ->limit(80)
                        ->get()
                        ->map(fn (Order $order) => $this->present($order))
                        ->values()
                        ->all(),
                    'server_time' => now()->toIso8601String(),
                ];
                $hash = md5(json_encode($payload));
                if ($hash !== $lastHash) {
                    echo "event: orders\n";
                    echo 'data: '.json_encode($payload)."\n\n";
                    $lastHash = $hash;
                } else {
                    echo ": ping\n\n";
                }
                if (ob_get_level() > 0) {
                    ob_flush();
                }
                flush();
                $ticks++;
                usleep(1200000);
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    private function present(Order $order): array
    {
        return [
            'id' => $order->id,
            'code' => $order->code,
            'customer_name' => $order->customer_name,
            'status' => $order->status,
            'items' => $order->items,
            'total_cents' => (int) $order->total_cents,
            'source' => $order->source,
            'created_at' => optional($order->created_at)?->toIso8601String(),
            'paid_at' => optional($order->paid_at)?->toIso8601String(),
            'preparing_at' => optional($order->preparing_at)?->toIso8601String(),
            'ready_at' => optional($order->ready_at)?->toIso8601String(),
            'completed_at' => optional($order->completed_at)?->toIso8601String(),
        ];
    }

    private function nextCode(): string
    {
        do {
            $code = 'B'.Str::upper(Str::random(1)).random_int(100, 999);
        } while (Order::where('code', $code)->exists());

        return $code;
    }
}

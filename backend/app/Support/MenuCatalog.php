<?php

namespace App\Support;

class MenuCatalog
{
    public static function all(): array
    {
        static $items = null;
        if ($items === null) {
            $raw = require __DIR__.'/menu_items.php';
            $items = array_map(static function (array $item): array {
                $item['image'] = '/sample/advance-kiosk/menu/item/'.$item['id'].'.svg';

                return $item;
            }, $raw);
        }

        return $items;
    }

    public static function find(string $id): ?array
    {
        foreach (self::all() as $item) {
            if ($item['id'] === $id) {
                return $item;
            }
        }

        return null;
    }

    public static function buildLines(array $items): array
    {
        $lines = [];
        $total = 0;
        foreach ($items as $row) {
            $menu = self::find((string) $row['id']);
            if (!$menu) {
                throw new \InvalidArgumentException('Unknown menu item: '.$row['id']);
            }
            $qty = (int) $row['qty'];
            $lineTotal = $menu['price_cents'] * $qty;
            $total += $lineTotal;
            $lines[] = [
                'id' => $menu['id'],
                'name' => $menu['name'],
                'qty' => $qty,
                'unit_cents' => $menu['price_cents'],
                'line_cents' => $lineTotal,
                'image' => $menu['image'],
            ];
        }

        return ['lines' => $lines, 'total_cents' => $total];
    }
}

<?php

namespace App\Support;

class MenuCatalog
{
    public static function all(): array
    {
        return [
            [
                'id' => 'chicken-joy',
                'name' => 'Chicken Joy Solo',
                'category' => 'Meals',
                'price_cents' => 9900,
                'tag' => 'Best seller',
                'color' => '#E23D28',
                'image' => '/sample/advance-kiosk/menu/chicken-joy.svg',
            ],
            [
                'id' => 'chicken-joy-meal',
                'name' => 'Chicken Joy Meal',
                'category' => 'Meals',
                'price_cents' => 14900,
                'tag' => 'With rice + drink',
                'color' => '#C62828',
                'image' => '/sample/advance-kiosk/menu/chicken-joy-meal.svg',
            ],
            [
                'id' => 'burger-steak',
                'name' => 'Burger Steak',
                'category' => 'Meals',
                'price_cents' => 8900,
                'tag' => 'Mushroom gravy',
                'color' => '#8D2B1B',
                'image' => '/sample/advance-kiosk/menu/burger-steak.svg',
            ],
            [
                'id' => 'jolly-spaghetti',
                'name' => 'Sweet Spaghetti',
                'category' => 'Pasta',
                'price_cents' => 6900,
                'tag' => 'Kid favorite',
                'color' => '#FF6F00',
                'image' => '/sample/advance-kiosk/menu/spaghetti.svg',
            ],
            [
                'id' => 'yumburger',
                'name' => 'Yum Burger',
                'category' => 'Burgers',
                'price_cents' => 4500,
                'tag' => 'Classic',
                'color' => '#F9A825',
                'image' => '/sample/advance-kiosk/menu/yumburger.svg',
            ],
            [
                'id' => 'peach-mango-pie',
                'name' => 'Peach Mango Pie',
                'category' => 'Desserts',
                'price_cents' => 3900,
                'tag' => 'Hot and crispy',
                'color' => '#FFB300',
                'image' => '/sample/advance-kiosk/menu/pie.svg',
            ],
            [
                'id' => 'fries',
                'name' => 'Crispy Fries',
                'category' => 'Sides',
                'price_cents' => 4900,
                'tag' => 'Shareable',
                'color' => '#FFC107',
                'image' => '/sample/advance-kiosk/menu/fries.svg',
            ],
            [
                'id' => 'float',
                'name' => 'Cola Float',
                'category' => 'Drinks',
                'price_cents' => 5900,
                'tag' => 'Ice cream top',
                'color' => '#5D4037',
                'image' => '/sample/advance-kiosk/menu/float.svg',
            ],
        ];
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

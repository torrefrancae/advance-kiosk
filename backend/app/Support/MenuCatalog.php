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
            ],
            [
                'id' => 'chicken-joy-meal',
                'name' => 'Chicken Joy Meal',
                'category' => 'Meals',
                'price_cents' => 14900,
                'tag' => 'With rice + drink',
                'color' => '#C62828',
            ],
            [
                'id' => 'burger-steak',
                'name' => 'Burger Steak',
                'category' => 'Meals',
                'price_cents' => 8900,
                'tag' => 'Mushroom gravy',
                'color' => '#8D2B1B',
            ],
            [
                'id' => 'jolly-spaghetti',
                'name' => 'Sweet Spaghetti',
                'category' => 'Pasta',
                'price_cents' => 6900,
                'tag' => 'Kid favorite',
                'color' => '#FF6F00',
            ],
            [
                'id' => 'yumburger',
                'name' => 'Yum Burger',
                'category' => 'Burgers',
                'price_cents' => 4500,
                'tag' => 'Classic',
                'color' => '#F9A825',
            ],
            [
                'id' => 'peach-mango-pie',
                'name' => 'Peach Mango Pie',
                'category' => 'Desserts',
                'price_cents' => 3900,
                'tag' => 'Hot and crispy',
                'color' => '#FFB300',
            ],
            [
                'id' => 'fries',
                'name' => 'Crispy Fries',
                'category' => 'Sides',
                'price_cents' => 4900,
                'tag' => 'Shareable',
                'color' => '#FFC107',
            ],
            [
                'id' => 'float',
                'name' => 'Cola Float',
                'category' => 'Drinks',
                'price_cents' => 5900,
                'tag' => 'Ice cream top',
                'color' => '#5D4037',
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
}

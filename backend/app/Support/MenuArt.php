<?php

namespace App\Support;

class MenuArt
{
    use MenuArtMotifs;

    public static function render(array $item): string
    {
        $id = (string) $item['id'];
        $name = self::xml((string) $item['name']);
        $tag = self::xml((string) ($item['tag'] ?? ''));
        $color = preg_match('/^#[0-9A-Fa-f]{6}$/', (string) $item['color']) ? (string) $item['color'] : '#E23D28';
        $deep = self::shade($color, -0.28);
        $lite = self::shade($color, 0.22);
        $motif = self::motif($id, $color, $lite, $deep);

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480" role="img" aria-label="{$name}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="{$deep}"/><stop offset="1" stop-color="{$color}"/>
    </linearGradient>
    <filter id="soft"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-opacity=".25"/></filter>
  </defs>
  <rect width="640" height="480" rx="48" fill="url(#bg)"/>
  <circle cx="540" cy="70" r="90" fill="{$lite}" opacity=".18"/>
  <circle cx="80" cy="420" r="120" fill="#000" opacity=".12"/>
  <g filter="url(#soft)">{$motif}</g>
  <rect x="28" y="28" width="420" height="92" rx="22" fill="rgba(0,0,0,.28)"/>
  <text x="48" y="66" fill="#FFD54F" font-family="Arial Black, Helvetica, sans-serif" font-size="28">{$name}</text>
  <text x="48" y="98" fill="#FFF8E7" font-family="Nunito, Helvetica, sans-serif" font-size="18" opacity=".92">{$tag}</text>
</svg>
SVG;
    }

    protected static function motif(string $id, string $color, string $lite, string $deep): string
    {
        return match (true) {
            str_contains($id, 'nuggets') => self::nuggets($id),
            str_contains($id, 'bucket') || str_contains($id, 'family') => self::bucket($id),
            str_contains($id, 'chicken') => self::chicken($id, $color),
            str_contains($id, 'champ') || str_contains($id, 'yumburger') || str_contains($id, 'bacon-egg') || str_contains($id, 'kids-burger') => self::burger($id),
            str_contains($id, 'burger-steak') => self::steak($id),
            str_contains($id, 'spaghetti') || str_contains($id, 'kids-spaghetti') => self::spaghetti($id),
            str_contains($id, 'palabok') => self::palabok(),
            str_contains($id, 'pie') => self::pie($id),
            str_contains($id, 'sundae') => self::sundae($id),
            str_contains($id, 'fries') => self::fries($id),
            str_contains($id, 'soup') || $id === 'extra-rice' || $id === 'gravy' || $id === 'macaroni-soup' => self::bowl($id),
            str_contains($id, 'float') || $id === 'softdrink' => self::floatCup($id),
            str_contains($id, 'coffee') || str_contains($id, 'chocolate') || $id === 'iced-tea' || $id === 'orange-juice' || $id === 'brewed-coffee' || $id === 'hot-chocolate' => self::drink($id),
            str_contains($id, 'pancake') => self::pancakes(),
            str_contains($id, 'hotdog') => self::hotdog(),
            str_contains($id, 'bfast') => self::breakfast($id),
            default => self::plate($lite, $deep),
        };
    }

    private static function shade(string $hex, float $amount): string
    {
        $hex = ltrim($hex, '#');
        $r = max(0, min(255, (int) round(hexdec(substr($hex, 0, 2)) + 255 * $amount)));
        $g = max(0, min(255, (int) round(hexdec(substr($hex, 2, 2)) + 255 * $amount)));
        $b = max(0, min(255, (int) round(hexdec(substr($hex, 4, 2)) + 255 * $amount)));

        return sprintf('#%02X%02X%02X', $r, $g, $b);
    }

    private static function xml(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_XML1, 'UTF-8');
    }
}

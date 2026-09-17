<?php

namespace App\Support;

trait MenuArtMotifs
{
    protected static function chicken(string $id, string $color): string
    {
        $spicy = str_contains($id, 'spicy');
        $pcs = str_contains($id, '2pc') ? 2 : 1;
        $meal = str_contains($id, 'meal') || str_contains($id, 'drink') || str_contains($id, '2pc') || str_contains($id, 'bfast');
        $parts = ['<ellipse cx="320" cy="390" rx="170" ry="24" fill="#000" opacity=".16"/>'];

        for ($i = 0; $i < $pcs; $i++) {
            $x = 250 + ($i * 110);
            $parts[] = <<<SVG
<g transform="translate({$x} 250)">
  <ellipse cx="0" cy="10" rx="78" ry="54" fill="#F4A460"/>
  <ellipse cx="-8" cy="4" rx="62" ry="40" fill="#E07A3D"/>
  <path d="M-50 -10c24-44 72-56 100-22 14 16 10 46-12 62-28 22-74 24-98 4-18-14-20-28-10-44z" fill="#C45C26"/>
  <circle cx="-28" cy="-6" r="7" fill="#FFD54F"/><circle cx="18" cy="-18" r="6" fill="#FFD54F"/>
</g>
SVG;
        }

        if ($spicy) {
            $parts[] = '<path d="M470 170c18-34 40-20 34 8-8 34-34 44-48 20" fill="#FF6F00"/><path d="M500 150c14-28 34-16 28 8-6 28-28 36-40 16" fill="#FFD54F"/>';
        }
        if ($meal) {
            $parts[] = '<ellipse cx="150" cy="310" rx="56" ry="28" fill="#FFF8E1"/><ellipse cx="150" cy="300" rx="44" ry="18" fill="#FFFDE7"/>';
            $parts[] = '<rect x="470" y="250" width="54" height="90" rx="14" fill="#1565C0"/><ellipse cx="497" cy="250" rx="28" ry="10" fill="#42A5F5"/>';
        }
        if (str_contains($id, 'bfast')) {
            $parts[] = '<ellipse cx="470" cy="300" rx="34" ry="34" fill="#FFECB3" stroke="#F9A825" stroke-width="6"/><circle cx="470" cy="300" r="12" fill="#FF8F00"/>';
        }

        return implode('', $parts);
    }

    protected static function nuggets(string $id): string
    {
        $count = str_contains($id, '10') ? 10 : 6;
        $parts = ['<ellipse cx="320" cy="390" rx="160" ry="22" fill="#000" opacity=".15"/>'];
        for ($i = 0; $i < $count; $i++) {
            $col = $i % 5;
            $row = intdiv($i, 5);
            $x = 170 + $col * 70;
            $y = 220 + $row * 70;
            $rot = ($i * 17) % 40 - 20;
            $fill = $i % 2 === 0 ? '#E07A3D' : '#F4A460';
            $parts[] = "<ellipse cx=\"{$x}\" cy=\"{$y}\" rx=\"28\" ry=\"20\" fill=\"{$fill}\" transform=\"rotate({$rot} {$x} {$y})\"/>";
        }
        $parts[] = '<ellipse cx="500" cy="320" rx="36" ry="18" fill="#FFF8E1"/><ellipse cx="500" cy="318" rx="26" ry="10" fill="#FF6F00" opacity=".85"/>';

        return implode('', $parts);
    }

    protected static function bucket(string $id): string
    {
        $pcs = str_contains($id, '8') ? 8 : 6;
        $hasPasta = str_contains($id, 'family-b');
        $extra = $hasPasta
            ? '<rect x="450" y="240" width="110" height="70" rx="16" fill="#FFF3E0"/><path d="M470 270c20 12 40-8 60 10" stroke="#FF6F00" stroke-width="8" fill="none"/>'
            : '<rect x="460" y="250" width="40" height="70" rx="10" fill="#1565C0"/><rect x="510" y="250" width="40" height="70" rx="10" fill="#1565C0"/>';

        return <<<SVG
<rect x="170" y="190" width="260" height="180" rx="28" fill="#FFD54F"/>
<rect x="190" y="210" width="220" height="40" rx="12" fill="#E23D28"/>
<text x="300" y="238" text-anchor="middle" fill="#FFD54F" font-family="Arial Black,sans-serif" font-size="22">{$pcs}-pc</text>
<ellipse cx="240" cy="300" rx="36" ry="24" fill="#E07A3D"/>
<ellipse cx="310" cy="290" rx="34" ry="22" fill="#F4A460"/>
<ellipse cx="370" cy="305" rx="36" ry="24" fill="#E07A3D"/>
{$extra}
SVG;
    }

    protected static function burger(string $id): string
    {
        $double = str_contains($id, 'double') || str_contains($id, 'champ');
        $cheese = str_contains($id, 'cheese') || str_contains($id, 'cheesy') || str_contains($id, 'champ') || str_contains($id, 'bacon');
        $meal = str_contains($id, 'meal');
        $y = $double ? 210 : 230;
        $parts = ['<ellipse cx="300" cy="390" rx="150" ry="20" fill="#000" opacity=".14"/>'];
        $parts[] = "<ellipse cx=\"300\" cy=\"{$y}\" rx=\"110\" ry=\"28\" fill=\"#F9A825\"/>";
        if ($cheese) {
            $parts[] = '<path d="M200 250h200l-20 24H220z" fill="#FFD54F"/>';
        }
        $parts[] = '<ellipse cx="300" cy="270" rx="105" ry="28" fill="#6D1F14"/>';
        if ($double) {
            $parts[] = '<ellipse cx="300" cy="300" rx="105" ry="26" fill="#8D2B1B"/>';
            if ($cheese) {
                $parts[] = '<path d="M205 312h190l-16 18H220z" fill="#FFD54F"/>';
            }
        }
        $bottom = $double ? 330 : 300;
        $parts[] = "<ellipse cx=\"300\" cy=\"{$bottom}\" rx=\"110\" ry=\"28\" fill=\"#F9A825\"/>";
        if (str_contains($id, 'bacon')) {
            $parts[] = '<path d="M220 255c30-10 60 12 90-4 24-12 50 8 70-2" stroke="#E23D28" stroke-width="10" fill="none"/>';
            $parts[] = '<ellipse cx="420" cy="250" rx="28" ry="28" fill="#FFECB3" stroke="#F9A825" stroke-width="5"/><circle cx="420" cy="250" r="10" fill="#FF8F00"/>';
        }
        if ($meal) {
            $parts[] = '<g transform="translate(470 250)"><rect x="0" y="20" width="28" height="70" rx="6" fill="#FFC107"/><rect x="34" y="10" width="28" height="80" rx="6" fill="#FFB300"/><rect x="68" y="28" width="28" height="62" rx="6" fill="#FFC107"/><rect x="110" y="40" width="40" height="70" rx="12" fill="#1565C0"/></g>';
        }

        return implode('', $parts);
    }

    protected static function steak(string $id): string
    {
        $pcs = str_contains($id, '2pc') ? 2 : 1;
        $meal = str_contains($id, 'meal') || str_contains($id, 'bfast');
        $parts = ['<ellipse cx="300" cy="340" rx="150" ry="70" fill="#FFF8E1"/>', '<ellipse cx="300" cy="340" rx="120" ry="40" fill="#FFE0B2"/>'];
        for ($i = 0; $i < $pcs; $i++) {
            $x = 240 + $i * 100;
            $parts[] = "<ellipse cx=\"{$x}\" cy=\"300\" rx=\"55\" ry=\"28\" fill=\"#6D1F14\"/><ellipse cx=\"{$x}\" cy=\"292\" rx=\"40\" ry=\"14\" fill=\"#8D2B1B\"/>";
        }
        $parts[] = '<path d="M220 320c40 20 90 24 140 8" stroke="#5D4037" stroke-width="10" fill="none" opacity=".55"/>';
        if ($meal || str_contains($id, 'bfast')) {
            $parts[] = '<ellipse cx="470" cy="300" rx="48" ry="24" fill="#FFFDE7"/>';
        }
        if (str_contains($id, 'bfast')) {
            $parts[] = '<ellipse cx="470" cy="240" rx="30" ry="30" fill="#FFECB3" stroke="#F9A825" stroke-width="5"/><circle cx="470" cy="240" r="10" fill="#FF8F00"/>';
        }

        return implode('', $parts);
    }

    protected static function spaghetti(string $id): string
    {
        $family = str_contains($id, 'family');
        $w = $family ? 220 : 150;
        $h = $family ? 100 : 70;

        return <<<SVG
<ellipse cx="300" cy="300" rx="{$w}" ry="{$h}" fill="#FFF3E0"/>
<path d="M180 280c50 30 90-20 140 18s90 8 140-16" stroke="#FF6F00" stroke-width="14" fill="none"/>
<path d="M190 310c45 22 85-14 130 12s85 10 125-12" stroke="#E65100" stroke-width="10" fill="none"/>
<circle cx="250" cy="270" r="10" fill="#E23D28"/><circle cx="330" cy="295" r="10" fill="#E23D28"/><circle cx="400" cy="268" r="10" fill="#E23D28"/>
<ellipse cx="300" cy="250" rx="70" ry="18" fill="#FFD54F" opacity=".9"/>
SVG
            .(str_contains($id, 'meal') || str_contains($id, 'kids')
                ? '<rect x="500" y="250" width="48" height="80" rx="14" fill="#1565C0"/>'
                : '');
    }

    protected static function palabok(): string
    {
        return <<<SVG
<ellipse cx="320" cy="300" rx="160" ry="75" fill="#FFF8E1"/>
<path d="M200 290c45 28 90-18 140 16s90 12 140-14" stroke="#FF7043" stroke-width="16" fill="none"/>
<circle cx="250" cy="270" r="9" fill="#E23D28"/><circle cx="320" cy="300" r="9" fill="#FFD54F"/><circle cx="390" cy="275" r="9" fill="#E23D28"/>
<circle cx="280" cy="310" r="8" fill="#8D6E63"/><circle cx="360" cy="315" r="8" fill="#8D6E63"/>
SVG;
    }

    protected static function pie(string $id): string
    {
        $large = str_contains($id, 'large');
        $trio = str_contains($id, 'trio');
        $scale = $large ? 1.2 : 1.0;
        $parts = [];
        $count = $trio ? 3 : 1;
        for ($i = 0; $i < $count; $i++) {
            $x = 240 + $i * 110;
            $y = 280;
            $parts[] = <<<SVG
<g transform="translate({$x} {$y}) scale({$scale})">
  <path d="M-70 20c10-90 130-90 140 0" fill="#F9A825"/>
  <path d="M-55 10c8-60 100-60 110 0" fill="#FFB300"/>
  <ellipse cx="0" cy="18" rx="72" ry="18" fill="#E07A3D"/>
  <circle cx="-10" cy="-20" r="10" fill="#FF6F00"/><circle cx="20" cy="-28" r="8" fill="#FFD54F"/>
</g>
SVG;
        }

        return implode('', $parts);
    }

    protected static function sundae(string $id): string
    {
        $cookies = str_contains($id, 'cookies');

        return <<<SVG
<path d="M250 190c18-50 120-50 140 0l34 170H216z" fill="#FFF8E1"/>
<ellipse cx="320" cy="190" rx="58" ry="28" fill="#5D4037"/>
<rect x="300" y="140" width="16" height="55" rx="6" fill="#FF8A65"/>
<circle cx="308" cy="132" r="10" fill="#E23D28"/>
SVG
            .($cookies
                ? '<circle cx="280" cy="230" r="12" fill="#6D4C41"/><circle cx="350" cy="250" r="10" fill="#6D4C41"/><circle cx="310" cy="280" r="11" fill="#6D4C41"/>'
                : '<path d="M270 220c30 20 70 20 100 0" stroke="#3E2723" stroke-width="10" fill="none"/>');
    }

    protected static function fries(string $id): string
    {
        $large = str_contains($id, 'large');
        $h = $large ? 110 : 80;

        return <<<SVG
<rect x="250" y="250" width="140" height="110" rx="18" fill="#E23D28"/>
<rect x="270" y="220" width="22" height="{$h}" rx="8" fill="#FFC107"/>
<rect x="300" y="205" width="22" height="95" rx="8" fill="#FFB300"/>
<rect x="330" y="215" width="22" height="105" rx="8" fill="#FFC107"/>
<rect x="360" y="225" width="22" height="95" rx="8" fill="#FFB300"/>
SVG
            .($large ? '<rect x="390" y="230" width="22" height="90" rx="8" fill="#FFC107"/>' : '');
    }

    protected static function bowl(string $id): string
    {
        $fill = match (true) {
            $id === 'gravy' => '#5D4037',
            $id === 'extra-rice' => '#FFFDE7',
            default => '#FFE082',
        };

        return <<<SVG
<ellipse cx="320" cy="320" rx="140" ry="48" fill="#ECEFF1"/>
<ellipse cx="320" cy="280" rx="130" ry="55" fill="{$fill}"/>
<ellipse cx="320" cy="268" rx="95" ry="28" fill="#FFF8E1" opacity=".55"/>
SVG;
    }

    protected static function floatCup(string $id): string
    {
        $float = str_contains($id, 'float');

        return <<<SVG
<rect x="270" y="200" width="100" height="170" rx="22" fill="#1565C0"/>
<ellipse cx="320" cy="200" rx="52" ry="16" fill="#42A5F5"/>
SVG
            .($float
                ? '<ellipse cx="320" cy="190" rx="40" ry="22" fill="#FFF8E1"/><circle cx="320" cy="170" r="18" fill="#FFF8E1"/><rect x="312" y="130" width="12" height="40" rx="5" fill="#FF8A65"/>'
                : '<path d="M290 250h60M290 290h60M290 330h60" stroke="#FFF8E7" stroke-width="8" opacity=".35"/>');
    }

    protected static function drink(string $id): string
    {
        $hot = str_contains($id, 'coffee') || str_contains($id, 'chocolate') || str_contains($id, 'brew');
        $juice = str_contains($id, 'orange');
        $tea = str_contains($id, 'tea');
        $liquid = $juice ? '#FB8C00' : ($tea ? '#F9A825' : '#6D4C41');

        return <<<SVG
<rect x="250" y="200" width="140" height="160" rx="24" fill="#FFF8E1"/>
<rect x="268" y="220" width="104" height="110" rx="16" fill="{$liquid}"/>
SVG
            .($hot
                ? '<path d="M390 240c36 0 36 70 0 70" stroke="#FFF8E1" stroke-width="12" fill="none"/><path d="M290 170c10-20 30-20 40 0M320 160c10-18 28-18 38 0" stroke="#FFF8E7" stroke-width="6" fill="none" opacity=".7"/>'
                : '<ellipse cx="320" cy="220" rx="52" ry="12" fill="#FFFDE7" opacity=".5"/>');
    }

    protected static function pancakes(): string
    {
        return <<<SVG
<ellipse cx="320" cy="320" rx="140" ry="36" fill="#D7A86E"/>
<ellipse cx="320" cy="290" rx="140" ry="36" fill="#E8B86D"/>
<ellipse cx="320" cy="260" rx="140" ry="36" fill="#F0C27A"/>
<path d="M250 240c50-16 110 0 140 24" stroke="#FF6F00" stroke-width="12" fill="none"/>
<ellipse cx="360" cy="230" rx="24" ry="16" fill="#FFF8E1"/>
SVG;
    }

    protected static function hotdog(): string
    {
        return <<<SVG
<ellipse cx="300" cy="320" rx="120" ry="40" fill="#FFF8E1"/>
<rect x="180" y="250" width="280" height="60" rx="30" fill="#F4A460"/>
<rect x="200" y="262" width="240" height="36" rx="18" fill="#E23D28"/>
<path d="M230 280h36M290 280h36M350 280h36M410 280h36" stroke="#FFD54F" stroke-width="6"/>
<ellipse cx="470" cy="250" rx="28" ry="28" fill="#FFECB3" stroke="#F9A825" stroke-width="5"/><circle cx="470" cy="250" r="10" fill="#FF8F00"/>
SVG;
    }

    protected static function breakfast(string $id): string
    {
        $meat = match (true) {
            str_contains($id, 'tapa') => '#6D1F14',
            str_contains($id, 'corned') => '#C62828',
            default => '#E23D28',
        };
        $drink = str_contains($id, 'drink');

        return <<<SVG
<ellipse cx="260" cy="300" rx="120" ry="70" fill="#FFF8E1"/>
<ellipse cx="220" cy="290" rx="50" ry="28" fill="#FFFDE7"/>
<ellipse cx="300" cy="300" rx="42" ry="24" fill="{$meat}"/>
<ellipse cx="260" cy="250" rx="34" ry="34" fill="#FFECB3" stroke="#F9A825" stroke-width="6"/>
<circle cx="260" cy="250" r="12" fill="#FF8F00"/>
SVG
            .($drink
                ? '<rect x="430" y="230" width="70" height="100" rx="16" fill="#6D4C41"/><path d="M500 250c28 0 28 55 0 55" stroke="#FFF8E1" stroke-width="10" fill="none"/>'
                : '');
    }

    protected static function plate(string $lite, string $deep): string
    {
        return <<<SVG
<ellipse cx="320" cy="300" rx="150" ry="70" fill="{$lite}"/>
<ellipse cx="320" cy="300" rx="110" ry="42" fill="{$deep}" opacity=".85"/>
SVG;
    }

}

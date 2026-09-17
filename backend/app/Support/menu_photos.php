<?php

/*
 * Brand-free plated food photos (Unsplash). No logo packaging.
 */
$u = static fn (string $photo): string => sprintf(
    'https://images.unsplash.com/%s?auto=format&fit=crop&w=720&h=540&q=80',
    $photo
);

return [
    /* Breakfast - plated home-style */
    'bfast-longganisa' => $u('photo-1525351484163-7529414344d8'),
    'bfast-longganisa-drink' => $u('photo-1533089860892-a7c6f0a88666'),
    'bfast-tapa' => $u('photo-1604908176997-125f25cc6f3d'),
    'bfast-tapa-drink' => $u('photo-1504674900247-0877df9cc836'),
    'bfast-corned-beef' => $u('photo-1414235077428-338989a2e8c0'),
    'bfast-chicken' => $u('photo-1598103442097-8b74394b95c6'),
    'bfast-hotdog' => $u('photo-1551782450-a2132b4ba21d'),
    'bfast-burger-steak' => $u('photo-1432139555190-58524dae6a55'),
    'bfast-pancakes' => $u('photo-1567620905732-2d1ec7ab7445'),
    'bfast-bacon-egg' => $u('photo-1525351484163-7529414344d8'),

    /* Chicken - plain fried chicken, no buckets/logos */
    'chicken-joy' => $u('photo-1626082927389-6cd097cdc6ec'),
    'chicken-joy-spicy' => $u('photo-1598515214211-89d3c73ae83b'),
    'chicken-joy-meal' => $u('photo-1562967914-608f82629710'),
    'chicken-joy-spicy-meal' => $u('photo-1626645738196-c2a7c87a8f58'),
    'chicken-joy-2pc' => $u('photo-1587593810167-a84920ea0781'),
    'chicken-joy-bucket-6' => \$u('photo-1626082927389-6cd097cdc6ec'),
    'chicken-joy-bucket-8' => \$u('photo-1626645738196-c2a7c87a8f58'),
    'chicken-nuggets-6' => $u('photo-1565299624946-b28f40a0ae38'),
    'chicken-nuggets-10' => $u('photo-1603133872878-684f208fb84b'),

    /* Burgers - studio plated, no wrappers */
    'yumburger' => $u('photo-1568901346375-23c9450c58cd'),
    'yumburger-cheese' => $u('photo-1572802419224-296b0aeee0d9'),
    'yumburger-double' => $u('photo-1553979459-d2229ba7433b'),
    'yumburger-meal' => \$u('photo-1568901346375-23c9450c58cd'),
    'champ-burger' => \$u('photo-1553979459-d2229ba7433b'),
    'champ-burger-meal' => \$u('photo-1550547660-d9450f859349'),

    /* Burger steak */
    'burger-steak' => $u('photo-1544025162-d76694265947'),
    'burger-steak-2pc' => $u('photo-1432139555190-58524dae6a55'),
    'burger-steak-meal' => $u('photo-1604908176997-125f25cc6f3d'),

    /* Pasta */
    'jolly-spaghetti' => $u('photo-1621996346565-e3dbc646d9a9'),
    'spaghetti-meal' => $u('photo-1551892374-ecf8754cf8b0'),
    'spaghetti-family' => $u('photo-1551183053-bf91a1d81141'),
    'palabok' => $u('photo-1563379926898-05f4575a45d8'),
    'palabok-meal' => $u('photo-1473093295043-cdd812d0e601'),
    'palabok-family' => $u('photo-1551183053-bf91a1d81141'),

    /* Family - shared plates, no branded packaging */
    'family-a-6' => $u('photo-1555939594-58d7cb561ad1'),
    'family-b-6' => $u('photo-1555939594-58d7cb561ad1'),
    'family-a-8' => $u('photo-1504754524776-8f4f37790ca0'),
    'family-b-8' => $u('photo-1546069901-ba9599a7e63c'),

    /* Kids */
    'kids-chicken' => $u('photo-1626082927389-6cd097cdc6ec'),
    'kids-spaghetti' => $u('photo-1621996346565-e3dbc646d9a9'),
    'kids-burger' => $u('photo-1568901346375-23c9450c58cd'),

    /* Sides */
    'fries' => $u('photo-1630384060421-cb20d0e0649d'),
    'fries-large' => $u('photo-1504674900247-0877df9cc836'),
    'macaroni-soup' => $u('photo-1547592166-23ac45744acd'),
    'extra-rice' => $u('photo-1516684669134-de6f7c473a2a'),
    'gravy' => $u('photo-1544025162-d76694265947'),

    /* Desserts */
    'peach-mango-pie' => $u('photo-1464305795204-6f5bbfc7fb81'),
    'peach-mango-pie-large' => $u('photo-1488477181946-6428a0291777'),
    'pie-trio' => $u('photo-1627308595229-7830a5c91f9f'),
    'chocolate-sundae' => $u('photo-1563805042-7684c019e1cb'),
    'cookies-cream-sundae' => $u('photo-1551024601-bec78aea704b'),

    /* Drinks - glasses/mugs only, no cans/logos */
    'softdrink' => $u('photo-1513558161293-cdaf765ed2fd'),
    'float' => $u('photo-1572490122747-3968b75cc699'),
    'iced-tea' => $u('photo-1556679343-c7306c1976bc'),
    'orange-juice' => $u('photo-1546173159-315724a31696'),
    'brewed-coffee' => $u('photo-1495474472287-4d71bcdd2085'),
    'hot-chocolate' => $u('photo-1544787219-7f47ccb76574'),
];

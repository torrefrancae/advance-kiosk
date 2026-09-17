<?php

$img = static fn (string $file): string => '/sample/advance-kiosk/menu/'.$file;

return [
    /* Breakfast */
    ['id' => 'bfast-longganisa', 'name' => 'Longganisa Breakfast', 'category' => 'Breakfast', 'price_cents' => 9900, 'tag' => 'Garlic rice + egg', 'color' => '#C62828', 'image' => $img('breakfast.svg')],
    ['id' => 'bfast-longganisa-drink', 'name' => 'Longganisa w/ Drink', 'category' => 'Breakfast', 'price_cents' => 11900, 'tag' => 'With hot brew', 'color' => '#B71C1C', 'image' => $img('breakfast.svg')],
    ['id' => 'bfast-tapa', 'name' => 'Beef Tapa Breakfast', 'category' => 'Breakfast', 'price_cents' => 10900, 'tag' => 'Garlic rice + egg', 'color' => '#8D2B1B', 'image' => $img('breakfast.svg')],
    ['id' => 'bfast-tapa-drink', 'name' => 'Beef Tapa w/ Drink', 'category' => 'Breakfast', 'price_cents' => 12900, 'tag' => 'Morning classic', 'color' => '#6D1F14', 'image' => $img('breakfast.svg')],
    ['id' => 'bfast-corned-beef', 'name' => 'Corned Beef Breakfast', 'category' => 'Breakfast', 'price_cents' => 9900, 'tag' => 'Garlic rice + egg', 'color' => '#E23D28', 'image' => $img('breakfast.svg')],
    ['id' => 'bfast-chicken', 'name' => 'Breakfast Chicken Joy', 'category' => 'Breakfast', 'price_cents' => 11900, 'tag' => '1-pc + rice + egg', 'color' => '#E23D28', 'image' => $img('chicken-joy.svg')],
    ['id' => 'bfast-hotdog', 'name' => 'Breakfast Hotdog', 'category' => 'Breakfast', 'price_cents' => 8900, 'tag' => 'Garlic rice + egg', 'color' => '#D32F2F', 'image' => $img('hotdog.svg')],
    ['id' => 'bfast-burger-steak', 'name' => 'Breakfast Burger Steak', 'category' => 'Breakfast', 'price_cents' => 9900, 'tag' => 'Gravy morning plate', 'color' => '#8D2B1B', 'image' => $img('burger-steak.svg')],
    ['id' => 'bfast-pancakes', 'name' => '2-pc Pancakes', 'category' => 'Breakfast', 'price_cents' => 7900, 'tag' => 'Butter + syrup', 'color' => '#F9A825', 'image' => $img('pancakes.svg')],
    ['id' => 'bfast-bacon-egg', 'name' => 'Bacon Egg Cheese Sandwich', 'category' => 'Breakfast', 'price_cents' => 9900, 'tag' => 'On soft bun', 'color' => '#FF8F00', 'image' => $img('yumburger.svg')],

    /* Chicken */
    ['id' => 'chicken-joy', 'name' => '1-pc Chicken Joy Solo', 'category' => 'Chicken', 'price_cents' => 9900, 'tag' => 'Best seller', 'color' => '#E23D28', 'image' => $img('chicken-joy.svg')],
    ['id' => 'chicken-joy-spicy', 'name' => '1-pc Spicy Chicken Joy', 'category' => 'Chicken', 'price_cents' => 10900, 'tag' => 'Extra kick', 'color' => '#B71C1C', 'image' => $img('chicken-joy.svg')],
    ['id' => 'chicken-joy-meal', 'name' => '1-pc Chicken Joy Meal', 'category' => 'Chicken', 'price_cents' => 14900, 'tag' => 'Rice + drink', 'color' => '#C62828', 'image' => $img('chicken-joy-meal.svg')],
    ['id' => 'chicken-joy-spicy-meal', 'name' => '1-pc Spicy Chicken Meal', 'category' => 'Chicken', 'price_cents' => 15900, 'tag' => 'Rice + drink', 'color' => '#8E0000', 'image' => $img('chicken-joy-meal.svg')],
    ['id' => 'chicken-joy-2pc', 'name' => '2-pc Chicken Joy w/ Drink', 'category' => 'Chicken', 'price_cents' => 19900, 'tag' => 'Share or feast', 'color' => '#E23D28', 'image' => $img('chicken-joy-meal.svg')],
    ['id' => 'chicken-joy-bucket-6', 'name' => '6-pc Chicken Joy Bucket', 'category' => 'Chicken', 'price_cents' => 44900, 'tag' => 'Family favorite', 'color' => '#C62828', 'image' => $img('family.svg')],
    ['id' => 'chicken-joy-bucket-8', 'name' => '8-pc Chicken Joy Bucket', 'category' => 'Chicken', 'price_cents' => 56900, 'tag' => 'Bigger family box', 'color' => '#B71C1C', 'image' => $img('family.svg')],
    ['id' => 'chicken-nuggets-6', 'name' => '6-pc Chicken Nuggets', 'category' => 'Chicken', 'price_cents' => 7900, 'tag' => 'Dip ready', 'color' => '#FF6F00', 'image' => $img('nuggets.svg')],
    ['id' => 'chicken-nuggets-10', 'name' => '10-pc Chicken Nuggets', 'category' => 'Chicken', 'price_cents' => 11900, 'tag' => 'Party snack', 'color' => '#EF6C00', 'image' => $img('nuggets.svg')],

    /* Burgers */
    ['id' => 'yumburger', 'name' => 'Yum Burger Solo', 'category' => 'Burgers', 'price_cents' => 4500, 'tag' => 'Classic', 'color' => '#F9A825', 'image' => $img('yumburger.svg')],
    ['id' => 'yumburger-cheese', 'name' => 'Cheesy Yum Burger', 'category' => 'Burgers', 'price_cents' => 5900, 'tag' => 'Melted cheese', 'color' => '#FFB300', 'image' => $img('yumburger.svg')],
    ['id' => 'yumburger-double', 'name' => 'Double Cheesy Yum Burger', 'category' => 'Burgers', 'price_cents' => 9900, 'tag' => 'Two patties', 'color' => '#FF8F00', 'image' => $img('champ.svg')],
    ['id' => 'yumburger-meal', 'name' => 'Yum Burger Meal', 'category' => 'Burgers', 'price_cents' => 9900, 'tag' => 'Fries + drink', 'color' => '#F9A825', 'image' => $img('yumburger.svg')],
    ['id' => 'champ-burger', 'name' => 'Champ Burger Solo', 'category' => 'Burgers', 'price_cents' => 12900, 'tag' => 'Big patty', 'color' => '#FF6F00', 'image' => $img('champ.svg')],
    ['id' => 'champ-burger-meal', 'name' => 'Champ Burger Meal', 'category' => 'Burgers', 'price_cents' => 17900, 'tag' => 'Fries + drink', 'color' => '#E65100', 'image' => $img('champ.svg')],

    /* Burger Steak */
    ['id' => 'burger-steak', 'name' => '1-pc Burger Steak', 'category' => 'Burger Steak', 'price_cents' => 6900, 'tag' => 'Mushroom gravy', 'color' => '#8D2B1B', 'image' => $img('burger-steak.svg')],
    ['id' => 'burger-steak-2pc', 'name' => '2-pc Burger Steak', 'category' => 'Burger Steak', 'price_cents' => 9900, 'tag' => 'Double gravy', 'color' => '#6D1F14', 'image' => $img('burger-steak.svg')],
    ['id' => 'burger-steak-meal', 'name' => 'Burger Steak Meal', 'category' => 'Burger Steak', 'price_cents' => 11900, 'tag' => 'Rice + drink', 'color' => '#8D2B1B', 'image' => $img('burger-steak.svg')],

    /* Pasta */
    ['id' => 'jolly-spaghetti', 'name' => 'Sweet Spaghetti Solo', 'category' => 'Pasta', 'price_cents' => 6900, 'tag' => 'Kid favorite', 'color' => '#FF6F00', 'image' => $img('spaghetti.svg')],
    ['id' => 'spaghetti-meal', 'name' => 'Sweet Spaghetti Meal', 'category' => 'Pasta', 'price_cents' => 10900, 'tag' => 'With drink', 'color' => '#EF6C00', 'image' => $img('spaghetti.svg')],
    ['id' => 'spaghetti-family', 'name' => 'Sweet Spaghetti Family Pan', 'category' => 'Pasta', 'price_cents' => 24900, 'tag' => 'Feeds 3-4', 'color' => '#E65100', 'image' => $img('spaghetti.svg')],
    ['id' => 'palabok', 'name' => 'Palabok Solo', 'category' => 'Pasta', 'price_cents' => 7900, 'tag' => 'Sauce + toppings', 'color' => '#FF8A65', 'image' => $img('palabok.svg')],
    ['id' => 'palabok-meal', 'name' => 'Palabok w/ Drink', 'category' => 'Pasta', 'price_cents' => 10900, 'tag' => 'With drink', 'color' => '#FF7043', 'image' => $img('palabok.svg')],
    ['id' => 'palabok-family', 'name' => 'Palabok Family Pan', 'category' => 'Pasta', 'price_cents' => 26900, 'tag' => 'Shareable pan', 'color' => '#F4511E', 'image' => $img('palabok.svg')],

    /* Family Meals */
    ['id' => 'family-a-6', 'name' => 'Family Super A (6-pc)', 'category' => 'Family Meals', 'price_cents' => 69900, 'tag' => '6 chicken + rice + sides + drinks', 'color' => '#C62828', 'image' => $img('family.svg')],
    ['id' => 'family-b-6', 'name' => 'Family Super B (6-pc)', 'category' => 'Family Meals', 'price_cents' => 74900, 'tag' => '6 chicken + spaghetti pan', 'color' => '#B71C1C', 'image' => $img('family.svg')],
    ['id' => 'family-a-8', 'name' => 'Family Super A (8-pc)', 'category' => 'Family Meals', 'price_cents' => 86900, 'tag' => '8 chicken + rice + sides + drinks', 'color' => '#8E0000', 'image' => $img('family.svg')],
    ['id' => 'family-b-8', 'name' => 'Family Super B (8-pc)', 'category' => 'Family Meals', 'price_cents' => 92900, 'tag' => '8 chicken + spaghetti pan', 'color' => '#7F0000', 'image' => $img('family.svg')],

    /* Kids */
    ['id' => 'kids-chicken', 'name' => 'Kids Chicken Meal', 'category' => 'Kids Meals', 'price_cents' => 12900, 'tag' => 'Toy surprise', 'color' => '#E23D28', 'image' => $img('chicken-joy-meal.svg')],
    ['id' => 'kids-spaghetti', 'name' => 'Kids Spaghetti Meal', 'category' => 'Kids Meals', 'price_cents' => 11900, 'tag' => 'Toy surprise', 'color' => '#FF6F00', 'image' => $img('spaghetti.svg')],
    ['id' => 'kids-burger', 'name' => 'Kids Burger Meal', 'category' => 'Kids Meals', 'price_cents' => 10900, 'tag' => 'Toy surprise', 'color' => '#F9A825', 'image' => $img('yumburger.svg')],

    /* Sides */
    ['id' => 'fries', 'name' => 'Crispy Fries Regular', 'category' => 'Sides', 'price_cents' => 4900, 'tag' => 'Shareable', 'color' => '#FFC107', 'image' => $img('fries.svg')],
    ['id' => 'fries-large', 'name' => 'Crispy Fries Large', 'category' => 'Sides', 'price_cents' => 6900, 'tag' => 'Extra crunch', 'color' => '#FFB300', 'image' => $img('fries.svg')],
    ['id' => 'macaroni-soup', 'name' => 'Creamy Macaroni Soup', 'category' => 'Sides', 'price_cents' => 5900, 'tag' => 'Warm bowl', 'color' => '#FFE082', 'image' => $img('soup.svg')],
    ['id' => 'extra-rice', 'name' => 'Extra Rice', 'category' => 'Sides', 'price_cents' => 2500, 'tag' => 'Steamed', 'color' => '#FFF8E1', 'image' => $img('soup.svg')],
    ['id' => 'gravy', 'name' => 'Extra Mushroom Gravy', 'category' => 'Sides', 'price_cents' => 2000, 'tag' => 'Side cup', 'color' => '#8D6E63', 'image' => $img('soup.svg')],

    /* Desserts */
    ['id' => 'peach-mango-pie', 'name' => 'Peach Mango Pie', 'category' => 'Desserts', 'price_cents' => 3900, 'tag' => 'Hot and crispy', 'color' => '#FFB300', 'image' => $img('pie.svg')],
    ['id' => 'peach-mango-pie-large', 'name' => 'Large Peach Mango Pie', 'category' => 'Desserts', 'price_cents' => 5900, 'tag' => 'Bigger pie', 'color' => '#FFA000', 'image' => $img('pie.svg')],
    ['id' => 'pie-trio', 'name' => 'Peach Mango Pie Trio', 'category' => 'Desserts', 'price_cents' => 10900, 'tag' => '3 pies to go', 'color' => '#FF8F00', 'image' => $img('pie.svg')],
    ['id' => 'chocolate-sundae', 'name' => 'Chocolate Sundae', 'category' => 'Desserts', 'price_cents' => 4900, 'tag' => 'Soft serve', 'color' => '#5D4037', 'image' => $img('sundae.svg')],
    ['id' => 'cookies-cream-sundae', 'name' => 'Cookies and Cream Sundae', 'category' => 'Desserts', 'price_cents' => 5900, 'tag' => 'Crunchy top', 'color' => '#4E342E', 'image' => $img('sundae.svg')],

    /* Drinks */
    ['id' => 'softdrink', 'name' => 'Regular Softdrink', 'category' => 'Drinks', 'price_cents' => 3900, 'tag' => 'Ice cold', 'color' => '#1565C0', 'image' => $img('float.svg')],
    ['id' => 'float', 'name' => 'Cola Float', 'category' => 'Drinks', 'price_cents' => 5900, 'tag' => 'Ice cream top', 'color' => '#5D4037', 'image' => $img('float.svg')],
    ['id' => 'iced-tea', 'name' => 'Iced Tea', 'category' => 'Drinks', 'price_cents' => 4500, 'tag' => 'House brew', 'color' => '#F9A825', 'image' => $img('coffee.svg')],
    ['id' => 'orange-juice', 'name' => 'Orange Juice', 'category' => 'Drinks', 'price_cents' => 4900, 'tag' => 'Chilled', 'color' => '#FB8C00', 'image' => $img('coffee.svg')],
    ['id' => 'brewed-coffee', 'name' => 'Hot Fresh Brew', 'category' => 'Drinks', 'price_cents' => 4900, 'tag' => 'Morning cup', 'color' => '#6D4C41', 'image' => $img('coffee.svg')],
    ['id' => 'hot-chocolate', 'name' => 'Hot Chocolate', 'category' => 'Drinks', 'price_cents' => 5900, 'tag' => 'Creamy cocoa', 'color' => '#4E342E', 'image' => $img('coffee.svg')],
];

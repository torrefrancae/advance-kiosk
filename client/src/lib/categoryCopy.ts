export const CATEGORY_COPY: Record<string, { title: string; blurb: string }> = {
  Breakfast: { title: 'Breakfast', blurb: 'Sunrise plates' },
  Chicken: { title: 'Chicken', blurb: 'Crispy & juicy' },
  Burgers: { title: 'Burgers', blurb: 'Stacked & toasted' },
  'Burger Steak': { title: 'Burger Steak', blurb: 'Gravy bowls' },
  Pasta: { title: 'Pasta', blurb: 'Sweet-sarap pans' },
  'Family Meals': { title: 'Family', blurb: 'Share the joy' },
  'Kids Meals': { title: 'Kids', blurb: 'Little trays' },
  Sides: { title: 'Sides', blurb: 'Extra crunch' },
  Desserts: { title: 'Desserts', blurb: 'Sweet finish' },
  Drinks: { title: 'Drinks', blurb: 'Ice-cold sips' },
};

export function categoryCopy(name: string) {
  return CATEGORY_COPY[name] ?? { title: name, blurb: 'Menu picks' };
}

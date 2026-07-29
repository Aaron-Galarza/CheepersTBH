export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const CATEGORIES = [
  'Hamburguesas',
  'Papas Fritas',
  'Pizzas',
  'Milanesas',
  'Bebidas',
  'Empanadas',
  'Sandwich',
  'Postres',
  'Promos',
] as const;

export function isActive(value: boolean): string {
  return value ? 'Activo' : 'Inactivo';
}

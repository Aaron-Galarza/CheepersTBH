
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(price);
};

export const formatDistance = (km: number): string => {
  return `${km.toFixed(1)} km`;
};

export const formatOrderNumber = (id: string): string => {
  return `#${id.substring(id.length - 4).toUpperCase()}`;
};
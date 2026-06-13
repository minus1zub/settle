export const formatPrice = (value: number) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);

export const pluralizeProducts = (count: number) => {
  const last = count % 10;
  const lastTwo = count % 100;

  if (last === 1 && lastTwo !== 11) return `${count} товар`;
  if ([2, 3, 4].includes(last) && ![12, 13, 14].includes(lastTwo)) return `${count} товара`;
  return `${count} товаров`;
};

const pad = (value: number, size = 2) => String(value).padStart(size, '0');

export const createOrderNumber = (date = new Date()) => {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86_400_000);
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${pad(dayOfYear, 3)}${hours}${minutes}`;
};

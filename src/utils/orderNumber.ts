const pad = (value: number, size = 2) => String(value).padStart(size, '0');

export const createOrderNumber = (date = new Date()) => {
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}${hours}${minutes}`;
};

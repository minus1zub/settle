const pad = (value: number, size = 2) => String(value).padStart(size, '0');

export const createOrderNumber = (date = new Date()) => {
  const year = pad(date.getFullYear() % 100);
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const centiseconds = pad(Math.floor(date.getMilliseconds() / 10));

  return `ST-${year}${month}${day}-${hours}${minutes}${seconds}-${centiseconds}`;
};

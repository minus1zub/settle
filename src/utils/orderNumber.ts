const pad = (value: number, size = 2) => String(value).padStart(size, '0');

export const createOrderNumber = (date = new Date()) => {
  const day = pad(date.getDate());
  const timePart = Number(`${pad(date.getHours())}${pad(date.getMinutes())}`);
  const fractionPart = date.getMilliseconds() * 10;
  const rollingPart = pad((timePart + fractionPart) % 10000, 4);

  return `${day}${rollingPart}`;
};

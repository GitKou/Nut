const percentFormatter = (digit = 1) =>
  new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: digit,
    maximumFractionDigits: digit,
  });

export { percentFormatter };

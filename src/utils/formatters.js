// Strictly formats values according to the Indian Rupee system to 2 decimal places
export const formatINR = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '—';
  const num = Number(value);
  const isNegative = num < 0;
  const absValue = Math.abs(num);

  const formatted = absValue.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${isNegative ? '-' : ''}₹${formatted}`;
};

// Accurately formats percentage returns (+, -, or neutral) to 2 decimal places
export const formatPercent = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '0.00%';
  const num = Number(value);
  if (num > 0) return `+${num.toFixed(decimals)}%`;
  if (num < 0) return `-${Math.abs(num).toFixed(decimals)}%`;
  return `${num.toFixed(decimals)}%`;
};
export function toFixed(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision + 1);
  const wholeNumber = Math.floor(value * multiplier);
  return (Math.round(wholeNumber / 10) * 10) / multiplier;
}

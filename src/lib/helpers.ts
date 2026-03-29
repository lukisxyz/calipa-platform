export function shortenAddress(value: string) {
  if (value.length < 14) return value;
  return `${value.slice(0, 8)}...${value.slice(-4)}`.toUpperCase();
}

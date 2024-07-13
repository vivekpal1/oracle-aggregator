export function formatPrice(price: number, expo: number): string {
    return (price * Math.pow(10, expo)).toFixed(2);
  }
  
  export function formatPercentage(value: number): string {
    return `${(value * 100).toFixed(2)}%`;
  }
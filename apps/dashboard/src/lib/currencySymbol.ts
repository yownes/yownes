export function currencySymbol(currency: string): string {
  if (currency.toLocaleUpperCase() === "EUR") {
    return "€";
  }
  if (currency.toLocaleUpperCase() === "USD") {
    return "$";
  }
  return currency;
}

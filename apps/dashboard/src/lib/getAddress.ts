export function getAddress(address: string): string {
  const normaliceAddress = address
    .replace(/None/g, "null")
    .replace(/True/g, "true")
    .replace(/False/g, "false")
    .replace(/'/g, '"');
  return normaliceAddress;
}

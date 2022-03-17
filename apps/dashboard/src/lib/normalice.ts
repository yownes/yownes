export function normalice(data: string): string {
  return data
    .replace(/None/g, "null")
    .replace(/True/g, "true")
    .replace(/False/g, "false")
    .replace(/'/g, '"');
}

export function buildGoogleMapsSearchUrl(addressParts: Array<string | null | undefined>) {
  const query = addressParts.filter(Boolean).join(", ");
  if (!query) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// Simple USDA Hardiness Zone lookup based on approximate lat/lng ranges
// Zones 3a-11b mapped to general US regions
export const getHardinessZone = (lat, lng) => {
  // Simplified zone mapping based on latitude and longitude ranges
  // This is a basic approximation; production would use more precise data or an API

  // Normalize to US bounds (approximate)
  if (lat < 24 || lat > 50 || lng < -130 || lng > -65) {
    return null; // Outside typical US range
  }

  // General zone rules (simplified)
  if (lat >= 48) {
    return lng < -110 ? '3a' : lng < -100 ? '3b' : '4a';
  }
  if (lat >= 46) {
    return lng < -110 ? '3b' : lng < -100 ? '4a' : '4b';
  }
  if (lat >= 44) {
    return lng < -110 ? '4a' : lng < -100 ? '4b' : '5a';
  }
  if (lat >= 42) {
    return lng < -110 ? '4b' : lng < -100 ? '5a' : '5b';
  }
  if (lat >= 40) {
    return lng < -110 ? '5a' : lng < -100 ? '5b' : '6a';
  }
  if (lat >= 38) {
    return lng < -110 ? '5b' : lng < -100 ? '6a' : '6b';
  }
  if (lat >= 36) {
    return lng < -110 ? '6a' : lng < -100 ? '6b' : '7a';
  }
  if (lat >= 34) {
    return lng < -110 ? '6b' : lng < -100 ? '7a' : '7b';
  }
  if (lat >= 32) {
    return lng < -110 ? '7a' : lng < -100 ? '8a' : '8b';
  }
  if (lat >= 30) {
    return lng < -110 ? '8a' : lng < -100 ? '8b' : '9a';
  }
  if (lat >= 28) {
    return lng < -110 ? '8b' : lng < -100 ? '9a' : '9b';
  }
  return lng < -100 ? '9b' : '10a';
};

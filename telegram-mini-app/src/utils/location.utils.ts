export function getDormCoordinates (dormName) {
  // Center of ASTU campus as fallback
  const fallback = { lat: 8.563, lng: 39.291 };
  if (!dormName) return fallback;

  // Example mappings (You can expand this dictionary based on actual ASTU geography)
  const dormMap: Record<string, { lat: number, lng: number }> = {
    "Block 40": { lat: 8.561, lng: 39.290 },
    "Block 45": { lat: 8.565, lng: 39.288 },
    "Geda Gate": { lat: 8.568, lng: 39.295 }
  };

  // Basic fuzzy match
  for (const [key, coords] of Object.entries(dormMap)) {
    if (dormName.toLowerCase().includes(key.toLowerCase())) {
      return coords;
    }
  }

  return fallback;
};
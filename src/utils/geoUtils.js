export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

export function calculateETA(distanceKm, speedKmph, stopWaitTimeMinutes = 0) {
  if (speedKmph <= 0) {
    return 0;
  }

  const travelTimeHours = distanceKm / speedKmph;
  const travelTimeMinutes = travelTimeHours * 60;

  return Math.ceil(travelTimeMinutes + stopWaitTimeMinutes);
}

export function getBearing(lat1, lon1, lat2, lon2) {
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);

  const bearing = Math.atan2(y, x);
  return (toDeg(bearing) + 360) % 360;
}

function toDeg(radians) {
  return radians * (180 / Math.PI);
}

export function isNearStop(busLat, busLon, stopLat, stopLon, thresholdKm = 0.1) {
  const distance = calculateDistance(busLat, busLon, stopLat, stopLon);
  return distance <= thresholdKm;
}

export default {
  calculateDistance,
  calculateETA,
  getBearing,
  isNearStop
};

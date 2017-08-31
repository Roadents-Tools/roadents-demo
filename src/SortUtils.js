

const EARTH_RADIUS_KM = 6371;

function toRadians(degs) {
  return degs * Math.PI/180;
}

function latLngDist(p0, p1) {
  var dLat = toRadians(p0.latitude - p1.latitude);
  var dLng = toRadians(p0.longitude - p1.longitude);

  var sindLat = Math.sin(dLat / 2);
  var sindLng = Math.sin(dLng / 2);

  var a = sindLat * sindLat + sindLng * sindLng
          * Math.cos(toRadians(p1.latitude) * Math.cos(toRadians(p0.latitude)));

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return c * EARTH_RADIUS_KM;
}

export function displacement(rt) {
  return latLngDist(rt.start, rt.dest);
}

export function distance(rt) {
  var rval = 0;
  for(var i = 1; i < rt.route.length; i++) {
    var pa = rt.route[i].pt[Object.keys(rt.route[i].pt)];
    var pb = rt.route[i-1].pt[Object.keys(rt.route[i-1].pt)];
    rval += latLngDist(pa, pb);
  }
  return rval;
}

export function walkTime(rt) {
  return rt.route
      .map(nd => nd.walkTimeFromPrev)
      .reduce((a, b) => a+b);
}

export function waitTime(rt) {
  return rt.route
      .map(nd => nd.waitTimeFromPrev)
      .reduce((a, b) => a+b);
}

export function travelTime(rt) {
  return rt.route
      .map(nd => nd.travelTimeFromPrev)
      .reduce((a, b) => a+b);
}

export function totalTime(rt) {
  return walkTime(rt) + waitTime(rt) + travelTime(rt);
}

export function nodeCount(rt) {
  return rt.route.length;
}

export function netVelocity(rt) {
  return displacement(rt)/totalTime(rt);
}

export function avgVelocity(rt) {
  const totalDist = distance(rt);
  var rval = 0;
  for(var i = 1; i < rt.route.length; i++) {
    var pa = rt.route[i].pt[Object.keys(rt.route[i].pt)];
    var pb = rt.route[i-1].pt[Object.keys(rt.route[i-1].pt)];
    var x = latLngDist(pa, pb);

    var dt = rt.route[i].waitTimeFromPrev + rt.route[i].walkTimeFromPrev + rt.route[i].travelTimeFromPrev;

    var unweightedVel = x/dt;
    var weight = x/totalDist;

    rval += weight * unweightedVel;
  }
  return rval;
}

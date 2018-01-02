

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
  return latLngDist(rt.start_pt, rt.end_pt);
}

export function distance(rt) {
  return rt.steps
  .map((stp) => {return latLngDist(stp.start_pt, stp.end_pt)})
  .reduce((a, b) => a + b)
}

export function walkTime(rt) {
  return rt.steps
      .filter((nd) => nd["step_type"] === "walk")
      .map(nd => nd.total_time)
      .reduce((a, b) => a+b);
}

export function waitTime(rt) {
  return rt.steps
      .filter(nd => nd["step_type"] === "transit")
      .map(nd => nd.wait_time)
      .reduce((a, b) => a+b);
}

export function travelTime(rt) {
  return rt.steps
      .filter(nd => nd["step_type"] === "transit")
      .map(nd => nd.travel_time)
      .reduce((a, b) => a+b);
}

export function totalTime(rt) {
  return rt.total_time;
}

export function nodeCount(rt) {
  return rt.steps.length;
}

export function netVelocity(rt) {
  return displacement(rt)/totalTime(rt);
}

export function avgVelocity(rt) {
  const totalDist = distance(rt);
  var rval = rt.steps.map(nd => {
    var dx = latLngDist(nd.start_pt, nd.end_pt)
    var dt = nd.total_time
    return dx/dt * dx/totalDist
  })
  .reduce((a, b) => a + b)
  return rval;
}

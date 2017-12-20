import {Promise} from 'es6-promise';
import callReq from 'request-promise';

var geocoder = {
  geocode : function(address) {
    var encaddr = encodeURIComponent(address);
    var req = {
      json : true,
      qs : {
        address :encaddr,
        benchmark : 9,
        format : 'json'
      },
      headers: {
        'Origin' : 'Donut-Demo'
      },
      method : 'GET',
      url: 'https://cors-anywhere.herokuapp.com/https://geocoding.geo.census.gov/geocoder/locations/onelineaddress',
    }
    return callReq(req)
      .then(result => {return {
        latitude : result.result.addressMatches[0].coordinates.y,
        longitude : result.result.addressMatches[0].coordinates.x
      }})
  }
}
var geostore = {};

export function geocode(address, i = 0) {
  let splitaddr = address.split(",");
  if(splitaddr.length === 2) {
    let lat = parseFloat(splitaddr[0])
    let lng = parseFloat(splitaddr[1])
    if(!isNaN(lat) && !isNaN(lng)) {
      return Promise.resolve({latitude : lat, longitude : lng})
    }
  }
  if(i > 2) {
    console.log("Too many retries.");
    return Promise.reject("Too many retries.");
  }
  return Promise.resolve(true)
    .then(b => {
      var cached = geostore[address];
      if(cached) {
        return cached;
      }
      else return geocoder.geocode(address);
    })
    .catch(err => {
      if(geostore[address]) return Promise.resolve(geostore[address]);
      else if(err.status === "OVER_QUERY_LIMIT") {
        return geocode(address, i + 1);
      }
      else {
        console.log(err);
        return Promise.reject(err);
      }
    })
    .then(it => {cacheValue(address, it); return it;})
    .catch((err) => {console.log(err);})

    .then(it => {
      return {latitude: it.latitude, longitude : it.longitude};
    })
    .catch((err) => {console.log(err);});

}

function cacheValue(address, point) {
  if(!address || !point) return false;
  if(geostore[address]) return true;
  geostore[address] = point;
  return true;
}

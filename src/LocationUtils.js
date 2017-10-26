import Geocoder from 'google-geocoder';
import {Promise} from 'es6-promise';

var geo = Geocoder({
  key: 'AIzaSyD3vHYwq7a3pvkeWZZrcZ7M9ipi4ZI3t4k'
});

var geostore = {};

export function geocode(address, i = 0) {
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
      else return new Promise(function(resolve, reject) {
        geo.find(address, function (err, resp) {
          if(err !== null) return reject(err);
          resolve(resp);
        })
      })
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
      return {latitude: it[0].location.lat, longitude : it[0].location.lng};
    })
    .catch((err) => {console.log(err);});

}

function cacheValue(address, point) {
  if(!address || !point) return false;
  if(geostore[address]) return true;
  geostore[address] = point;
  return true;
}

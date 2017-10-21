import {Promise} from 'es6-promise';

export function delay(milli, rval) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve(rval);
    }, milli);
  });
}

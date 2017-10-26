import {Promise} from 'es6-promise';
import callReq from 'request-promise';

export function delay(milli, rval) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve(rval);
    }, milli);
  });
}

export function call(url) {
  var opts = {
    uri: url,
    json: true
  }

  return callReq(opts);
}

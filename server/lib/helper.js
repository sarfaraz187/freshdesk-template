const base64 = require('base-64');

async function requestApi(options) {
  var opt = {
    headers: {
      "Authorization": "Basic " + base64.encode(options.apiKey + ":x"),
      "Content-Type": "application/json; charset=utf-8"
    }
  };
  let request = ('body' in options) ? $request[options.method](options.url, options.body, opt) : $request[options.method](options.url, opt);
  return new Promise((resolve, reject) => {
    request.then(data => {
      console.log(data.response);
      resolve(data.response);
    }, error => {
      reject(error);
    });
  }).catch(error => console.log(error));
}

function handleResponse(err, resp) {
  if (!err && resp.statusCode === 200) {
    console.log(JSON.stringify({
      status: resp.statusCode,
      message: 'success'
    }));
  }
}

exports = {
  requestApi: requestApi,
  handleResponse: handleResponse,
};
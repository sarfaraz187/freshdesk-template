const helpers = require("./lib/helper");

exports = {
  onAppInstallCallback: function(payload) {
    console.log(payload);
  },
  onScheduledEventHandler: function(payload) {
    console.log(payload);
  },
  onTicketUpdateCallback: function(payload) {
    console.log("Logging arguments from onTicketUpdate event: " + JSON.stringify(payload));
  },
  fetchApiResponse: async function(args) {
    let response = await helpers.requestApi(args);
    renderData(null, response);
  }
};

function oneTimeSchedular(data, index) {
  var time = moment().add(index + 1, "m");
  $schedule.create({
    name: `ticket_name_${index}`,
    data: { data },
    schedule_at: time,
  }).then(function (data) {
    console.log('schedule create successful', data);
  }, function (err) {
    console.log('schedule create failed in one Time schedular', err);
  });
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function requestApi(options) {
  var opt = {
    headers: {
      "Authorization": "Basic " + base64.encode(options.iparams.apiKey + ":x"),
      "Content-Type": "application/json; charset=utf-8"
    }
  };
  let url = (options.iparams.domain.startsWith('https://')) ? `${options.iparams.domain}/` + options.url : `https://${options.iparams.domain}/` + options.url;
  console.log("URL : ", url);
  let request = ('body' in options) ? axios[options.method](url, options.body, opt) : axios[options.method](url, opt)
  var [error, result] = await unityFunction(request);
  if (error) {
    console.log(error.response.data.errors);
  } else {
    return result.data;
  }
}

function unityFunction(promise, improved) {
  return promise.then((data) => [null, data], (err) => {
    if (improved) {
      Object.assign(err, improved);
    }
    return [err];
  });
}

function recurringSchedular(timeAt) {
  $schedule.create({
    name: "close_cluster_scheduler",
    data: { "initialize" : 1 },
    schedule_at: timeAt,
    repeat: { time_unit: "hours", frequency: 24 },
    // repeat: { time_unit: "minutes", frequency: 30 }
  }).then(function(data) {
    console.log(data)
  }, err => console.log(err));
}
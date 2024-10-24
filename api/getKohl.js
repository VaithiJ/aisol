// var request = require('request');
// var options = {
//   'method': 'GET',
//   'url': 'https://rpc.api-pump.fun/king',
//   'headers': {
//     'x-api-key': '915e966f-4823-456b-a0c9-f9488f2c68ee'
//   }
// };
// request(options, function (error, response) {
//   if (error) throw new Error(error);
//   console.log(response.body);
// });


var https = require('follow-redirects').https;
var fs = require('fs');

var options = {
  'method': 'GET',
  'hostname': 'rpc.api-pump.fun',
  'path': '/bondingCurve?token=71YXjhuLND5GFP4pvXawXt9dDMuTkN2ibJgXi1LBpump',
  'headers': {
    'Content-Type': 'application/json',
    'x-api-key': '915e966f-4823-456b-a0c9-f9488f2c68ee'
  },
  'maxRedirects': 20
};

var req = https.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

req.end();
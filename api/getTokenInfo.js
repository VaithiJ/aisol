var https = require('follow-redirects').https;
var fs = require('fs');

var options = {
  'method': 'GET',
  'hostname': 'rpc.api-pump.fun',
  'path': '/info?token=5mbK36SZ7J19An8jFochhQS4of8g6BwUjbeCSxBSoWdp',
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
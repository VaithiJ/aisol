var https = require('follow-redirects').https;

var options = {
  'method': 'GET',
  'hostname': 'rpc.api-pump.fun',
  'path': '/balance?token=H2CyhNW6MJ1pbSat6UCPwr7BJfejkuSLooFWVhH7vMua&wallet=AxmTFeNgkh9dRGFyMTSX2HPTd4QQWnJCbRWKavhty8UY',
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

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log('Response:', res.statusCode, res.statusMessage);
    console.log('Headers:', res.headers);
    console.log('Body:', body.toString());
  });

  res.on("error", function (error) {
    console.error('Error:', error);
  });
});

req.end();

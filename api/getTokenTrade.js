const WebSocket = require('ws');

const ws = new WebSocket('wss://pumpportal.fun/api/data');

ws.on('open', function open() {
  // Subscribing to token creation events
  // let payload = {
  //     method: "subscribeNewToken", 
  //   }
  // ws.send(JSON.stringify(payload));

  // Subscribing to trades made by accounts
  let payload = {
      method: "subscribeAccountTrade",
      keys: ["BJ8mUn9d916zTYVDa6p6LhbvYj6JKHE5hy6CF8tUdXnj", "AGduCDWYEFWWPPVbH4AHHoHPXJZZQVK6VZCyEDgAe8RA"] // array of accounts to watch
    }
  ws.send(JSON.stringify(payload));

  // Subscribing to trades on tokens
//   let payload = {
//       method: "subscribeTokenTrade",
//       keys: ["2FR6UW2FfUkit6yrX2DfbLivb7V8oXQQUCVdGSYrffTM"] // array of token CAs to watch
//     }
//   ws.send(JSON.stringify(payload));
});

ws.on('message', function message(data) {
  console.log(JSON.parse(data));
});

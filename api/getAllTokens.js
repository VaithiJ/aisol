const WebSocket = require('ws');

const ws = new WebSocket('wss://pumpportal.fun/api/data');

ws.on('open', function open() {
    // Subscribing to trades for a specific account
    payload = {
        method: "subscribeNewToken",
        params: []
      }
    ws.send(JSON.stringify(payload));
    console.log('Subscription payload sent:', payload);
});

ws.on('message', function message(data) {
    console.log(JSON.parse(data));
});

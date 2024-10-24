// const express = require('express');
// const { createProxyMiddleware } = require('http-proxy-middleware');

// const app = express();

// app.use(
//   '/tokens/latest',
//   createProxyMiddleware({
//     target: 'https://solana.p.nadles.com',
//     changeOrigin: true,
//     headers: {
//       'applicationType': 'JSON',
//       'X-Billing-Token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjEifQ.eyJpc3MiOiJuYWRsZXMiLCJpYXQiOiIxNzI0MDY4MDA1IiwicHVycG9zZSI6ImFwaV9hdXRoZW50aWNhdGlvbiIsInN1YiI6ImQwNDlhOGI4YzQ3MjQxZGJhYzJhZDViZjU1M2I5MDY0In0.1YhxvOqEfAIOkRpOu9ylx3tWUTvAgFXZ4_ZdN7aLg40'
//     }
//   })
// );

// app.listen(3001, () => {
//   console.log('Proxy server is running on port 3001');
// });

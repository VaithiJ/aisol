import { createProxyMiddleware } from 'http-proxy-middleware';
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/tokens/latest',
        destination: 'https://solana.p.nadles.com/tokens/latest',
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.devServer = {
        ...config.devServer,
        before: (app) => {
          app.use(
            '/tokens/latest',
            createProxyMiddleware({
              target: 'https://solana.p.nadles.com',
              changeOrigin: true,
              headers: {
                'applicationType': 'JSON',
                'X-Billing-Token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjEifQ.eyJpc3MiOiJuYWRsZXMiLCJpYXQiOiIxNzI0MDY4MDA1IiwicHVycG9zZSI6ImFwaV9hdXRoZW50aWNhdGlvbiIsInN1YiI6ImQwNDlhOGI4YzQ3MjQxZGJhYzJhZDViZjU1M2I5MDY0In0.1YhxvOqEfAIOkRpOu9ylx3tWUTvAgFXZ4_ZdN7aLg40'
              }
            })
          );
        },
      };
    }
    return config;
  },
};

export default nextConfig;

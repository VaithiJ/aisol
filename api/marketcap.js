const { Connection, PublicKey } = require('@solana/web3.js');
const { PythHttpClient, PriceStatus } = require('@pythnetwork/client');

const SOLANA_RPC_URL = 'https://long-alpha-field.solana-mainnet.quiknode.pro/c617b25af2ec2148c43ebd3a9389673c3fde4607';
const PYTH_PUBLIC_KEY = new PublicKey('3waDFXLnur92px9qc1tfwjNo9Jc65MCCVwT9qw7Lpump'); // Replace with the actual Pyth price account for the token

const connection = new Connection(SOLANA_RPC_URL);

async function fetchMarketCap() {
  try {
    const pythClient = new PythHttpClient(connection, PYTH_PUBLIC_KEY);
    const data = await pythClient.getData();

    for (let symbol of data.symbols) {
      const price = data.productPrice.get(symbol);
      if (price) {
        console.log(`${symbol}: $${price.price} ±$${price.confidence} Status: ${PriceStatus[price.status]}`);
      }
    }
  } catch (error) {
    console.error('Error fetching market cap:', error);
  }
}

fetchMarketCap();

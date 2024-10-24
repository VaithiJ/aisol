// pages/api/getWalletValue.js
import Moralis from 'moralis';
import dotenv from 'dotenv';

dotenv.config();


const apiKey = process.env.MORALIS_KEY;
const url = process.env.API_URL; // Replace with your QuickNode RPC URL


export default async function handler(req, res) {
    const { mint } = req.query;
  
    try {
      // Fetch the top holders of the token
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getTokenLargestAccounts',
          params: [mint],
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.result && data.result.value) {
        const holders = data.result.value.slice(1, 6); // Skip the first holder and take the next 5
  
        await Moralis.start({ apiKey });
  
        // Fetch the portfolio and calculate the total value for each holder
        const holderValues = await Promise.all(holders.map(async (holder) => {
          const accountInfoResponse = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 'my-id',
              method: 'getAccountInfo',
              params: [holder.address, { encoding: 'jsonParsed' }],
            }),
          });
  
          if (!accountInfoResponse.ok) {
            throw new Error(`HTTP error! status: ${accountInfoResponse.status}`);
          }
  
          const accountInfo = await accountInfoResponse.json();
          const ownerAddress = accountInfo.result.value.data.parsed.info.owner;
  
          const portfolioResponse = await Moralis.SolApi.account.getPortfolio({
            network: "mainnet",
            address: ownerAddress,
          });
  
          const portfolio = portfolioResponse.raw;
          const tokenHoldings = portfolio.tokens.map(token => ({
            mint: token.mint,
            amount: parseFloat(token.amount),
          }));
  
          // Sort by amount and get first 10 tokens
          tokenHoldings.sort((a, b) => b.amount - a.amount);
          const first10Tokens = tokenHoldings.slice(0, 10);
  
          // Fetch prices for the first 10 tokens
          const tokenPrices = await fetchTokenPrices(first10Tokens.map(token => token.mint));
  
          // Calculate total value
          const totalValue = first10Tokens.reduce((sum, token) => {
            const price = tokenPrices[token.mint]?.usdPrice || 0;
            return sum + (token.amount * price);
          }, 0);
  
          return {
            ownerAddress,
            totalValue,
          };
        }));
  
        res.status(200).json(holderValues);
      } else {
        res.status(400).json({ error: 'Unexpected response structure' });
      }
    } catch (error) {
      console.error('Error fetching token holders:', error);
      res.status(500).json({ error: 'Error fetching token holders' });
    }
  }
  
  const fetchTokenPrices = async (mints) => {
    const prices = {};
    for (const mint of mints) {
      const response = await Moralis.SolApi.token.getTokenPrice({
        network: "mainnet",
        address: mint,
      });
      console.log(`Price response for ${mint}:`, response.raw); // Log the response
      prices[mint] = response.raw;
    }
    console.log('Prices:', prices);
  
    return prices;
  };
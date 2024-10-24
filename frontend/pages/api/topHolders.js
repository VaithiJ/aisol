import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const url = process.env.API_URL; // Use the environment variable

export default async function handler(req, res) {
  const { mint, tokenSupply } = req.query;

  const realtokensupply = tokenSupply / 1000000;

  try {
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
      const holders = data.result.value.slice(0, 5); // Only take the first 5 holders

      const formattedHolders = holders.map((holder) => {
        const percentage = (holder.uiAmount / realtokensupply) * 100; // Calculate percentage
        return {
          address: holder.address,
          amount: holder.uiAmount,
          uiAmountString: holder.uiAmountString,
          percentage: percentage.toFixed(2), // Format percentage to 2 decimal places
        };
      });

      res.status(200).json(formattedHolders);
    } else {
      res.status(400).json({ error: 'Unexpected response structure' });
    }
  } catch (error) {
    console.error('Error fetching token holders:', error);
    res.status(500).json({ error: 'Error fetching token holders' });
  }
}

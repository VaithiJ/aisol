// pages/api/latestTokens.js
import dotenv from 'dotenv';

dotenv.config();
export default async function handler(req, res) {
    const apiUrl = 'https://solana.p.nadles.com/tokens/latest';
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'applicationType': 'JSON',
          'X-Billing-Token': process.env.TOKEN
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching latest tokens, status: ${response.status}`);
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tokens', error: error.message });
    }
  }
  
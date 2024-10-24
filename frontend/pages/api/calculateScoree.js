
// /pages/api/calculateScore.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { Worker } from 'worker_threads';
import path from 'path';

dotenv.config(); // Load environment variables

const url = process.env.API_URL; // Use the environment variable
const xToken = process.env.TOKEN2;

const runWorker = (data) => {
  return new Promise((resolve, reject) => {
    const workerPath = path.resolve('./workers/worker1.js');
    const worker = new Worker(workerPath);
    worker.postMessage(data);
    
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
};

export default async function handler(req, res) {
  const { token } = req.body;
  const { mint } = token.token;
  const { pools } = token;
  const tokenSupply = pools[0]?.tokenSupply; // Use optional chaining for safety
  let realtokensupply;

  if (tokenSupply) {
    if (tokenSupply > 100000000000) { // Greater than 100 billion
      realtokensupply = tokenSupply / 1000000; // Divide by 1 million
    } else if (tokenSupply >= 1000000 && tokenSupply <= 1000000000) { // Between 1 million and 1 billion
      realtokensupply = tokenSupply; // Don't divide
    } else {
      realtokensupply = tokenSupply; // For values less than 1 million, keep as is
    }
  } else {
    realtokensupply = 0; // Default to 0 if tokenSupply is undefined
  }

  try {
    // First API call to get token largest accounts
    const accountsResponse = await fetch(url, {
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

    if (!accountsResponse.ok) {
      throw new Error(`HTTP error! status: ${accountsResponse.status}`);
    }

    const accountsData = await accountsResponse.json();

    if (accountsData.result && accountsData.result.value) {
      // Prepare data for the worker
      const workerData = {
        accountsData,
        realtokensupply,
        token,
        pools,
      };

      // Run the worker and wait for the result
      const result = await runWorker(workerData);

      res.status(200).json(result);
    } else {
      res.status(400).json({ error: 'Unexpected response structure' });
    }
  } catch (error) {
    console.error('Error fetching token holders:', error);
    res.status(500).json({ error: 'Error fetching token holders' });
  }
}
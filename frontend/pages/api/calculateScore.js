import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { Worker } from 'worker_threads';
import path from 'path';

dotenv.config(); // Load environment variables

const url = process.env.API_URL;
const xToken = process.env.TOKEN;

function runWorker(data) {
  return new Promise((resolve, reject) => {
    const workerPath = path.resolve('./workers/worker.js');
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
}

export default async function handler(req, res) {
  const { token } = req.body;
  const { mint } = token.token;
  const { pools } = token;
  const tokenSupply = pools[0].tokenSupply;
  const realtokensupply = tokenSupply / 1000000;

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
      const firstHolder = accountsData.result.value[0];
      const holders = accountsData.result.value.slice(1, 11);

      const formattedHolders = holders.map((holder) => ({
        address: holder.address,
        uiAmount: holder.uiAmount,
      }));

      // Use worker to process data
      const workerData = {
        firstHolder,
        realtokensupply,
        formattedHolders,
        token,
      };
      const { bundled, samePercentages, totalPoints, apeMessage, distro, life } = await runWorker(workerData);

      // Fetch the owner accounts for holders at indices 1 to 6
      const ownerAccounts = await Promise.all(formattedHolders.slice(0, 5).map(async (holder) => {
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
        return accountInfo.result.value.data.parsed.info.owner;
      }));

      res.status(200).json({
        bundled: bundled ? 'Bundled' : 'No bundle',
        samePercentages,
        telegram: !!token.token.telegram,
        twitter: !!token.token.twitter,
        website: !!token.token.website,
        name: token.token.name,
        ownerAccounts,
        totalPoints,
        apeMessage,
        distro,
        life,
      });

    } else {
      res.status(400).json({ error: 'Unexpected response structure' });
    }
  } catch (error) {
    console.error('Error fetching token holders:', error);
    res.status(500).json({ error: 'Error fetching token holders' });
  }
}

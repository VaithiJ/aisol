import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { Worker } from 'worker_threads';
import path from 'path';
import axios from 'axios'; // Import axios for HTTP requests
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

dotenv.config(); // Load environment variables

const url = process.env.API_URL;
const xToken = process.env.TOKEN;

// Initialize OAuth 1.0a
const oauth = OAuth({
  consumer: {
    key: process.env.TWITTER_CONSUMER_KEY,
    secret: process.env.TWITTER_CONSUMER_SECRET,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(baseString, key) {
    return crypto.createHmac('sha1', key).update(baseString).digest('base64');
  },
});

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

// Function to post a tweet
async function postTweet(ca, totalPoints, bundled, distro, life, name, description) {
  try {
    // Determine the message based on life status and totalPoints
    let message;

    if (life === "Alive") {
      if (totalPoints >= 40) {
        message = "Can ape!";
      } else if (totalPoints >= 30) {
        message = "Good one!";
      } else {
        message = "Risky.";
      }
    } else if (life === "Almost Dead") {
      message = "Too risky to ape.";
    } else if (life === "Dead") {
      message = "Rugged.";
    } else {
      // Default message in case of an unexpected life status
      message = "Unknown status.";
    }

    // Customize the tweet content based on message
    let tweetContent;
    if (message === "Rugged.") {
      tweetContent = {
        text: `Name: $${name}\nCA: ${ca}\nDescription: ${description}\nMessage: ${message}`,
      };
    } else {
      tweetContent = {
        text: `Name: $${name}\nCA: ${ca}\nDescription: ${description}\nMessage: ${message}\nBundled: ${bundled}\nTop 5 distribution: ${distro}`,
      };
    }

    const requestData = {
      url: 'https://api.x.com/2/tweets',
      method: 'POST',
    };

    const token = {
      key: process.env.TWITTER_ACCESS_TOKEN,
      secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    };

    // Generate the OAuth headers
    const headers = oauth.toHeader(oauth.authorize(requestData, token));
    headers['Content-Type'] = 'application/json';

    const response = await axios.post(requestData.url, tweetContent, { headers });
    console.log('Tweet posted successfully!', response.data);
  } catch (error) {
    console.error('Error posting tweet:', error.response ? error.response.data : error.message);
  }
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
        token
        
      };
      const { bundled, ca, samePercentages, totalPoints, apeMessage, distro, life , name,description} = await runWorker(workerData);

      // Check if totalPoints is greater than 25 and post a tweet
      if (totalPoints > 5) {
        await postTweet(ca, totalPoints, bundled, distro, life, name,description);
      }

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

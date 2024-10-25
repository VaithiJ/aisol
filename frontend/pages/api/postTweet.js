// pages/api/postTweet.js
import axios from 'axios';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { config } from 'dotenv';

config(); // Load environment variables

// Initialize OAuth 1.0a with hash_function
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

// Function to post a tweet
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const tweetContent = {
      text: req.body.text, // Accept tweet content from the request body
    };

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

    try {
      const response = await axios.post(requestData.url, tweetContent, { headers });
      res.status(200).json({ message: 'Tweet posted successfully!', data: response.data });
    } catch (error) {
      res.status(500).json({ message: 'Error posting tweet', error: error.response ? error.response.data : error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

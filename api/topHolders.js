const fetch = require('node-fetch'); // Make sure to install node-fetch if not already installed

const tokenMintAddress = '5mbK36SZ7J19An8jFochhQS4of8g6BwUjbeCSxBSoWdp'; // Replace with your token mint address

const url = `https://long-alpha-field.solana-mainnet.quiknode.pro/c617b25af2ec2148c43ebd3a9389673c3fde4607`; // Replace with your QuickNode RPC URL

const getTopTokenHolders = async (mint) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getTokenLargestAccounts',
        params: [mint], // Pass the mint address
      }),
    });


    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { result } = await response.json();

    if (result && result.value) {
      const topHolders = result.value.slice(0, 10); // Get top 10 holders
      console.log('Top 10 Token Holders:', topHolders); // Log the holders
    } else {
      console.error('Unexpected response structure');
    }
  } catch (error) {
    console.error('Error fetching top token holders:', error);
  }
};

getTopTokenHolders(tokenMintAddress); // Call the function with the token mint address

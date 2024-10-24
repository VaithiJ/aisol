const fetch = require('node-fetch'); // Make sure to install node-fetch if not already installed

const ownerAddress = '7YDVBgGngDWuX9FrjzWiyAwjBqkMd94V5uEUmvNsTLn7'; // Replace with your token mint address

const url = `https://long-alpha-field.solana-mainnet.quiknode.pro/c617b25af2ec2148c43ebd3a9389673c3fde4607`; // Replace with your QuickNode RPC URL

const getAccountInfo = async (address) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAccountInfo',
        params: [address], // Pass the mint address
      }),
    });


    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { result } = await response.json();

console.log(result)
  } catch (error) {
    console.error('Error fetching top token holders:', error);
  }
};

getAccountInfo(ownerAddress); // Call the function with the token mint address

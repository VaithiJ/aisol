const Moralis = require('moralis').default;
const fetch = require('node-fetch'); // Make sure to install node-fetch if not already installed

const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImI2MjJjODYzLWQ4ODMtNDJjOS1iM2EzLTZiYTFhOTBlMmI1MSIsIm9yZ0lkIjoiMjY3ODIzIiwidXNlcklkIjoiMjcyNTY0IiwidHlwZUlkIjoiZGUwYTUxMjktNDk3MS00MDkwLTk1YzAtNzkzMTNhODgwZmIwIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTgzOTA2MDYsImV4cCI6NDg1NDE1MDYwNn0.EKnl1MVNuh9KkNAub2jxQEGY-YJn6N75Sic33UblUCo"; // Replace with your Moralis API key
const tokenAccountAddress = "7aeb67hZL2K9pefQyEdSH5MqvNfHqMpirNGSLirv5bgp"; // Replace with the token account address
const url = `https://long-alpha-field.solana-mainnet.quiknode.pro/c617b25af2ec2148c43ebd3a9389673c3fde4607`; // Replace with your QuickNode RPC URL

const getWalletValue = async () => {
  try {
    // Fetch the owner of the token account
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAccountInfo',
        params: [tokenAccountAddress, { encoding: 'jsonParsed' }],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const accountInfo = await response.json();
    const ownerAddress = accountInfo.result.value.data.parsed.info.owner;
    console.log(`Owner of account ${tokenAccountAddress}: ${ownerAddress}`);

    await Moralis.start({ apiKey });

    // Fetch the portfolio of the owner
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

    console.log('Total Wallet Value (USD):', totalValue);
  } catch (e) {
    console.error(e);
  }
};

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

getWalletValue();

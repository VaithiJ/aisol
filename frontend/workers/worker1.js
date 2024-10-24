// /workers/worker.js
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const { parentPort } = require('worker_threads');

dotenv.config(); // Load environment variables

const url = process.env.API_URL; // Use the environment variable


parentPort.on('message', async (data) => {
    
  const {
    accountsData,
    realtokensupply,
    token,
    pools,
  } = data;

  // Extract first holder from accounts data
  const firstHolder = accountsData.result.value[0];
  const holders = accountsData.result.value.slice(1, 11); // Next 10 holders

  // Calculate first holder percentage
  const firstHolderPercentage = (firstHolder.uiAmount / realtokensupply) * 100;

  // Format holders and calculate their percentages
  const formattedHolders = holders.map((holder) => {
    const percentage = (holder.uiAmount / realtokensupply) * 100; // Calculate percentage
    return {
      address: holder.address,
      percentage: parseFloat(percentage.toFixed(2)), // Format to 2 decimal places
    };
  }).filter(holder => holder.percentage > 0); // Remove holders with 0%

  // Check for bundled percentages
  let bundled = false;
  let percentageCount = {};
  formattedHolders.forEach(holder => {
    percentageCount[holder.percentage] = (percentageCount[holder.percentage] || 0) + 1;
  });

  let samePercentages = Object.keys(percentageCount)
    .filter(key => percentageCount[key] > 1)
    .map(key => parseFloat(key))
    .sort((a, b) => percentageCount[b] - percentageCount[a])
    .slice(0, 2);

  if (samePercentages.length > 0) {
    bundled = true;
  }



  // Check social media presence
  const telegram = !!token.token.telegram;
  const twitter = !!token.token.twitter;
  const website = !!token.token.website;
  const name = token.token.name;

  // Calculate distribution category
  const totalPercentage = formattedHolders.reduce((sum, holder) => sum + holder.percentage, 0);
  let distro;
  if (totalPercentage > 20) {
    distro = '>20%';
  } else if (totalPercentage >= 10 && totalPercentage <= 20) {
    distro = '10-20%';
  } else {
    distro = '<10%';
  }

  // Determine life status
  let life = firstHolderPercentage > 90 ? 'Almost Dead' : 'Alive';
  if (firstHolderPercentage >= 97) {
    life = 'Dead';
  }

  // Calculate total points
  let totalPoints = 0;

  if (life !== 'Dead') {
    // Social media points
    if (telegram && twitter && website) {
      totalPoints += 10;
    } else {
      if (telegram) totalPoints += 4;
      if (twitter) totalPoints += 4;
      if (website) totalPoints += 2;
    }

    // Bundling points
    totalPoints += bundled ? 10 : 20;

    // Distribution points
    if (distro === '10-20%') {
      totalPoints += 5;
    } else if (distro === '<10%') {
      totalPoints += 10;
    }

    // Life status points
    if (life === 'Almost Dead') {
      totalPoints -= 20;
    }
  }

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

  // Check market cap and adjust total points
  const marketCapUsd = pools[0]?.marketCap?.usd;

  if (marketCapUsd !== undefined) {
    if (marketCapUsd < 5000) {
      totalPoints -= totalPoints; // Reduce points
    } else if (marketCapUsd > 5000 && marketCapUsd <= 6000 && totalPoints >= 20) {
      totalPoints -= 25;
    } else if (marketCapUsd > 7000 && marketCapUsd <= 10000 && totalPoints >= 30) {
      totalPoints -= 10;
    } else if (marketCapUsd > 10000 && marketCapUsd <= 20000 && totalPoints >= 40) {
      totalPoints -= 15;
    } else if (marketCapUsd > 80000 && marketCapUsd <= 150000  && totalPoints <= 25) {
      totalPoints += 5; // Add points
    } else if (marketCapUsd > 300000 && totalPoints <= 25) {
        totalPoints += 20; // Add points
      }
  }

  // Ensure totalPoints does not go below 0
  totalPoints = Math.max(totalPoints, 0);

  // Determine apeMessage based on totalPoints
  let apeMessage;
  if (totalPoints >= 40) {
    apeMessage = "Mr Punk's Play! 🤑";
  } else if (totalPoints >= 30) {
    apeMessage = "Ansem Play! 💰";
  } else if (totalPoints >= 20) {
    apeMessage = "Mitch's Play! 😎";
  } else if (totalPoints >= 10) {
    apeMessage = "6ix9ine Play! ☠️";
  } else {
    apeMessage = "Yugu's play! 💩";
  }

  // Send result back to main thread
  parentPort.postMessage({ 
    bundled,
    samePercentages,
    ownerAccounts,
    telegram,
    twitter,
    name,
    website,
    distro,
    life,
    totalPoints,
    apeMessage
  });
});

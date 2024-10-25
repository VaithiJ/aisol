// /workers/worker.js
const { parentPort } = require('worker_threads');

parentPort.on('message', (data) => {
  const { firstHolder, realtokensupply, formattedHolders, token } = data;

  const firstHolderPercentage = (firstHolder.uiAmount / realtokensupply) * 100;

  const holdersWithPercentage = formattedHolders.map((holder) => {
    const percentage = (holder.uiAmount / realtokensupply) * 100;
    return {
      address: holder.address,
      percentage: parseFloat(percentage.toFixed(2)),
    };
  }).filter(holder => holder.percentage > 0);

  let bundled = false;
  let percentageCount = {};
  holdersWithPercentage.forEach(holder => {
    if (percentageCount[holder.percentage]) {
      percentageCount[holder.percentage]++;
    } else {
      percentageCount[holder.percentage] = 1;
    }
  });

  let samePercentages = Object.keys(percentageCount)
    .filter(key => percentageCount[key] > 1)
    .map(key => parseFloat(key))
    .sort((a, b) => percentageCount[b] - percentageCount[a])
    .slice(0, 2);

  if (samePercentages.length > 0) {
    bundled = true;
  }


  const totalPercentage = holdersWithPercentage.reduce((sum, holder) => sum + holder.percentage, 0);
  let distro;
  if (totalPercentage > 20) {
    distro = '>20%';
  } else if (totalPercentage >= 10 && totalPercentage <= 20) {
    distro = '10-20%';
  } else {
    distro = '<10%';
  }

  let life = firstHolderPercentage > 90 ? 'Almost Dead' : 'Alive';
  if (firstHolderPercentage >= 97) {
    life = 'Dead';
  }

  let totalPoints = 0;
  const { telegram, twitter, website } = token.token;

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

  let apeMessage;
  if (totalPoints >= 40) {
    apeMessage = "best";
  } else if (totalPoints >= 30) {
    apeMessage = "better";
  } else if (totalPoints >= 20) {
    apeMessage = "good";
  } else if (totalPoints >= 10) {
    apeMessage = "bad";
  } else {
    apeMessage = "dead";
  }

  parentPort.postMessage({
    bundled,
    samePercentages,
    totalPoints,
    apeMessage,
    distro,
    name: token.token.symbol,
    description: token.token.description,
    life,
    ca:token.token.mint,
    shouldTweet: totalPoints > 25 // Add this line

  });
});

const { Connection, PublicKey } = require('@solana/web3.js');

const url = 'https://long-alpha-field.solana-mainnet.quiknode.pro/c617b25af2ec2148c43ebd3a9389673c3fde4607'; // Replace with your Solana RPC URL
const publicKeyString = '7K86zf6fBXuas852ExMHv5me3ggGdWViVTGjrioCRAB2'; // Replace with your public key

const checkAccountCreationDate = async (publicKey) => {
  try {
    const connection = new Connection(url, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0 // Add this parameter
    });
    const publicKeyObj = new PublicKey(publicKey);

    let before = null;
    let earliestBlockTime = null;

    while (true) {
      const signatures = await connection.getConfirmedSignaturesForAddress2(publicKeyObj, { before, limit: 100 });

      if (signatures.length === 0) break;

      for (const signature of signatures) {
        const transaction = await connection.getConfirmedTransaction(signature.signature, {
          commitment: 'confirmed', // Ensure the commitment level is set here as well
          maxSupportedTransactionVersion: 0 // Add this parameter
        });
        if (transaction && transaction.blockTime) {
          if (!earliestBlockTime || transaction.blockTime < earliestBlockTime) {
            earliestBlockTime = transaction.blockTime;
          }
        }
      }

      before = signatures[signatures.length - 1].signature;
    }

    if (earliestBlockTime) {
      const creationDate = new Date(earliestBlockTime * 1000);
      console.log('Account Creation Date:', creationDate);
    } else {
      console.log('No transactions found for this account.');
    }
  } catch (error) {
    console.error('Error fetching transaction history:', error);
  }
};

checkAccountCreationDate(publicKeyString); // Call the function with the public key

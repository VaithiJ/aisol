const { Connection, PublicKey } = require('@solana/web3.js');

const walletPublicKey = new PublicKey('9ZTUbHHJALEppS6N2Fo8mbM5bPryEYJ7c4i6MPewaJUy'); // Replace with your wallet's public key
const rpcUrl = 'https://long-alpha-field.solana-mainnet.quiknode.pro/c617b25af2ec2148c43ebd3a9389673c3fde4607/'; // Replace with your QuickNode RPC URL
const wsUrl = 'wss://long-alpha-field.solana-mainnet.quiknode.pro/c617b25af2ec2148c43ebd3a9389673c3fde4607'; // Replace with your QuickNode WebSocket URL

const connection = new Connection(rpcUrl, { wsEndpoint: wsUrl });

const trackTrades = async (publicKey) => {
  connection.onLogs(publicKey, (logs, context) => {
    console.log('New transaction logs:', logs);
  }, 'confirmed');

  console.log(`Tracking trades for wallet: ${publicKey.toBase58()}`);
};

const pollTrades = async (publicKey) => {
  try {
    const transactionSignatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
    const signatures = transactionSignatures.map(tx => tx.signature);
    const transactions = await connection.getParsedTransactions(signatures);

    transactions.forEach((tx, index) => {
      console.log(`Transaction ${index + 1}:`);
      console.log(`Signature: ${tx.transaction.signatures[0]}`);
      console.log(`Block Time: ${new Date(tx.blockTime * 1000).toLocaleString()}`);
      console.log(`Status: ${tx.meta.status}`);
      console.log('Instructions:', tx.transaction.message.instructions);
      console.log('---');
    });
  } catch (error) {
    console.error('Error tracking trades:', error);
  }
};

// Poll every 5 minutes (300000 milliseconds)
setInterval(() => pollTrades(walletPublicKey), 300000);

trackTrades(walletPublicKey);
pollTrades(walletPublicKey);

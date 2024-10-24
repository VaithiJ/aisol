import React, { useState, useEffect } from 'react';
import NavBar2 from '@/components/smartaudit/NavBar2.js';
import { GridBackgroundDemo } from '@/components/smartaudit/ui/GridDemo';
import { FaCopy, FaExternalLinkAlt } from 'react-icons/fa'; // Import the icons

const TrackWallet = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [ws, setWs] = useState(null); // WebSocket state
  const [isTracking, setIsTracking] = useState(false); // Tracking state
  const [isTrackingInProgress, setIsTrackingInProgress] = useState(false); // Tracking indicator
  const [error, setError] = useState(null); // Error state

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
    }).catch((error) => {
      console.error('Error copying to clipboard:', error);
    });
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isTracking) {
        e.preventDefault();
        e.returnValue = 'Tracking will be stopped if you reload the page. Do you want to proceed?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      if (ws) {
        ws.close();
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [ws, isTracking]);

  const handleTrack = () => {
    if (isTracking) {
      // Unsubscribe and stop tracking
      if (ws) {
        ws.close(); // Close the WebSocket connection
      }
      setWs(null);
      setIsTracking(false);
      setIsTrackingInProgress(false); // Hide tracking indicator
      setTransactions([]); // Clear transactions
      setWalletAddress(''); // Clear wallet address
    } else {
      // Show tracking indicator
      setIsTrackingInProgress(true);

      // Create a new WebSocket connection
      const socket = new WebSocket('wss://pumpportal.fun/api/data');

      socket.onopen = () => {
        console.log('WebSocket connection opened.');
        setError(null); // Clear any previous errors

        // Send subscription payload
        const payload = {
          method: "subscribeAccountTrade",
          keys: [walletAddress], // subscribe to the wallet address entered
        };
        socket.send(JSON.stringify(payload));
        console.log('Subscription payload sent:', payload);

        // Update tracking state
        setWs(socket); // Set WebSocket state
        setIsTracking(true);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received data:', data);

          // Process the received data and update transactions
          const transaction = {
            type: data.txType,
            tokenAddress: data.mint,
            newTokenBalance: data.newTokenBalance,
            tokenAmount: data.tokenAmount,
            signature: data.signature,
            date: new Date().toLocaleDateString() // Only show date
          };

          setTransactions((prevTransactions) => [
            ...prevTransactions,
            transaction
          ]);
        } catch (error) {
          console.error('Error parsing WebSocket data:', error);
          setError('Error parsing WebSocket data');
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket error');
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed.');
        setIsTrackingInProgress(false); // Hide tracking indicator when connection closes
      };
    }
  };

  return (
    <div className="w-full min-h-screen bg-black pt-20 relative z-10"> {/* Add z-10 here */}
    <GridBackgroundDemo className="z-0" /> {/* Set z-0 for background */}
    <NavBar2 className="relative z-10" logo="/ps.png" /> {/* Add z-10 to NavBar2 */}
  
    {/* Form container */}
    <div className="flex justify-center items-center h-screen relative z-20"> {/* Increase z-index */}
      <div className="w-full max-w-md p-10 mb-40 moving-border bg-transparent border-2 border-yellow-400 rounded-lg shadow-lg shadow-yellow-400 transition-shadow duration-300" style={{ minHeight: '350px' }}>
        <h2 className="text-center text-xl font-semibold text-white mb-6">Enter Wallet Address to Track</h2>
  
        <input
          type="text"
          placeholder="Wallet Address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          disabled={isTracking} // Disable input when tracking
          className="w-full px-4 py-3 bg-transparent border border-yellow-400 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 mb-4"
        />
  
        <button
          onClick={handleTrack}
          className={`w-full px-4 py-3 ${isTracking ? 'bg-red-400' : 'bg-yellow-400'} text-black font-bold rounded-lg hover:bg-${isTracking ? 'red-500' : 'yellow-500'} transition-colors`}
        >
          {isTracking ? 'Stop Tracking' : 'Track'}
        </button>
  
        {/* Tracking indicator */}
        {isTrackingInProgress && (
          <div className="mt-4 text-center text-white animate-pulse">
            Tracking...
          </div>
        )}
  
        {/* Error message */}
        {error && (
          <div className="mt-4 text-center text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  
    {transactions.length > 0 && (
      <div className="w-full max-w-4xl mx-auto px-4 mt-10 relative z-20"> {/* Increase z-index */}
        <h3 className="text-2xl text-yellow-400 font-semibold mb-4 text-center underline">TRANSACTIONS</h3>
        <div className="space-y-2">
          {transactions.map((txn, index) => (
            <div
              key={index}
              className={`text-white p-2 border-b border-yellow-400 `}
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Transaction Type */}
                <div className="col-span-1 text-sm">
                  <strong>Transaction Type:</strong> 
                  <span className={`ml-2 text-lg font-bold ${txn.type === 'buy' ? 'text-green-500' : txn.type === 'sell' ? 'text-red-500' : ''}`}>
                    {txn.type ? txn.type.toUpperCase() : 'N/A'}
                  </span>
                </div>
  
                {/* Token Address */}
                <div className="col-span-2 text-sm flex items-center">
                  <strong>Token Address:</strong> {txn.tokenAddress}
                  <FaCopy className="ml-2 cursor-pointer" onClick={() => handleCopy(txn.tokenAddress)} />
                </div>
  
                {/* New Token Balance */}
                <div className="col-span-1 text-sm">
                  <strong>New Token Balance:</strong> {txn.newTokenBalance}
                </div>
  
                {/* Token Amount */}
                <div className="col-span-1 text-sm">
                  <strong>Token Amount:</strong> {txn.tokenAmount}
                </div>
  
                {/* Signature */}
                <div className="col-span-2 text-sm flex items-center">
                  <strong>Signature:</strong> {txn.signature}
                  <a
                    href={`https://solscan.io/tx/${txn.signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-400"
                  >
                    <FaExternalLinkAlt />
                  </a>
                </div>
  
                {/* Date */}
                <div className="col-span-2 text-xs text-gray-400">
                  {txn.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
  
  );
};

export default TrackWallet;

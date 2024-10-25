

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/smartaudit/Navbar';
import { FaCopy, FaInfoCircle, FaTwitter, FaTelegram, FaGlobe } from 'react-icons/fa'; // Import social icons
import NavBar2 from '@/components/smartaudit/NavBar2.js';
import { GridBackgroundDemo } from '@/components/smartaudit/ui/GridDemo';
import MatrixEffect from './MatrixEffect';

const CoinList = () => {
  const [tokens, setTokens] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tokensPerPage = 32;
  const [selectedToken, setSelectedToken] = useState(null);
  const [holdersData, setHoldersData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingToken, setLoadingToken] = useState(null); // Track loading per token
  const [showModal, setShowModal] = useState(false); // Show modal state
  const [modalToken, setModalToken] = useState(null); // Token data for modal
  const [modalData, setModalData] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true); // New state for initial loading
  const [dataLoaded, setDataLoaded] = useState(false); // New state to track data loading
  const [pollingLoading, setPollingLoading] = useState(false); // Loading state for polling
  const [loadingMessage, setLoadingMessage] = useState("");

  const [loadingDots, setLoadingDots] = useState('');

  const loadingTexts = [
    "Sentibot is processing deep data insights...",
    "Scanning for bundled assets with Sentibot...",
    "Initiating matrix analysis mode...",
    "Cracking complex data patterns...",
    "Sentibot is sifting through blockchain bytes...",
    "Analyzing top token holders...",
    "Decrypting token history files...",
    "Compiling your results with Sentibot...",
    "Reading blockchain landscapes...",
    "Scanning ownership structures...",
    "Loading AI-powered insights...",
    "Sentibot diving into deep data...",
    "Identifying high-value distribution...",
    "Connecting to secure data streams...",
    "Mapping token behavior...",
    "Inspecting data nodes...",
    "Sentibot is preparing your dashboard...",
    "Assembling token metrics...",
    "Processing unique ownership details...",
    "Gathering final analysis results..."
  ];
  

  const [tweetText, setTweetText] = useState('');

  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/postTweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: tweetText }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Error posting tweet:', error);
    }
  };
  useEffect(() => {
    // Select a new random message when the modal is shown
    if (showModal) {
      setLoadingMessage(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]);
    }
  }, [showModal]);
  useEffect(() => {
    // Simulate AI fetching process and manage dots animation
    const loadingInterval = setInterval(() => {
      setLoadingDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 500); // Adjust the speed of the dot animation

    // Simulate loading completion
    setTimeout(() => {
      setInitialLoading(false);
    }, 4000); // Set the loading duration for simulation

    return () => clearInterval(loadingInterval);
  }, []);
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const fetchTokenDetails = async (mint) => {
    const apiUrl = `/api/deployerTokens?mint=${mint}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching deployer tokens, status: ${response.status}`);
      }
      const data = await response.json();
      return data.is_currently_live;
    } catch (error) {
      console.error('Error fetching token details:', error);
      return false; // Fallback in case of error
    }
  };

  const fetchData = async (isInitialFetch = false) => {
    if (isInitialFetch) {
      setInitialLoading(true); // Show loader only for the initial fetch
      setDataLoaded(false); // Reset data loaded state
    } else {
      setPollingLoading(true); // Show loader for polling
    }

    const apiUrl = '/api/latestTokens'; // Local proxy route

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const updatedTokens = await Promise.all(data.map(async (token) => {
        const isLive = await fetchTokenDetails(token.token.mint);

        // Calculate stats
        const deployerTokensCount = token.pools[0]?.deployer ? data.filter(t => t.pools[0]?.deployer === token.pools[0].deployer).length : 0;
        const hitRaydiumCount = token.raydium_pool ? 1 : 0;
        const kohCount = token.king_of_the_hill_timestamp ? 1 : 0;

        return {
          ...token,
          dct: deployerTokensCount,
          hr: hitRaydiumCount,
          koh: kohCount,
          isLive
        };
      }));

      setTokens(updatedTokens);
      console.log('Total tokens fetched:', data.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      if (isInitialFetch) {
        setInitialLoading(false); // Hide loader for initial fetch
        setDataLoaded(true); // Set data loaded to true after initial fetch
      } else {
        setPollingLoading(false); // Hide loader for polling
      }
    }
  };

  useEffect(() => {
    fetchData(true); // Fetch data initially

    // const interval = setInterval(() => {
    //   fetchData(false); // Polling every 5 seconds
    // }, 5000);

    // return () => clearInterval(interval); // Clean up interval when component unmounts
  }, []);



  const handleViewHolderPercentages = async (mint, tokenSupply) => {
    setLoadingToken(mint); // Set the loading state only for the clicked token
    try {
      const response = await fetch(`/api/topHolders?mint=${mint}&tokenSupply=${tokenSupply}`);
      const data = await response.json();
  
      if (Array.isArray(data)) {
        setHoldersData(data);
        setSelectedToken(mint);
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error('Error fetching holder percentages:', error);
    } finally {
      setLoadingToken(false); // Set the loading state only for the clicked token
    }
  };

  const handleViewScore = async (token) => {
    setIsLoading(true);
    setModalToken(token);
  
    try {
      const response = await fetch(`/api/calculateScore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }), // Send the entire token object
      });
      const data = await response.json();
      setModalData(data); // Store the entire API response data
    } catch (error) {
      console.error('Error fetching token data:', error);
    } finally {
      setIsLoading(false);
      setShowModal(true);
    }
  };
  

  useEffect(() => {
    fetchData(); // Fetch data initially

    const interval = setInterval(() => {
      fetchData(); // Polling every 5 seconds
    }, 5000);

    return () => clearInterval(interval); // Clean up interval when component unmounts
  }, []);

  const indexOfLastToken = currentPage * tokensPerPage;
  const indexOfFirstToken = indexOfLastToken - tokensPerPage;
  const currentTokens = tokens.slice(indexOfFirstToken, indexOfLastToken);

  const nextPage = () => {
    if (currentPage < Math.ceil(tokens.length / tokensPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatSupply = (supply, decimals) => {
  
    // Ensure supply and decimals are numbers
    const supplyNumber = Number(supply);
    const decimalsNumber = Number(decimals);
  
    if (isNaN(supplyNumber) || isNaN(decimalsNumber)) {
      return 'Invalid supply or decimals';
    }
  
    // If decimals is 9 or greater, return the supply as is
    if (decimalsNumber >= 9) {
      return supplyNumber.toLocaleString();
    }
  
    // Calculate the divisor based on decimals
    const divisor = Math.pow(10, decimalsNumber);
  
    // Adjust the supply
    const adjustedSupply = supplyNumber / divisor;
  
    // Format the supply with comma separators and no decimal places
    return adjustedSupply.toFixed(0).toLocaleString();
  };

  return (
    <>
    <MatrixEffect />
    <div className="w-full min-h-screen relative">
      <canvas id="matrixCanvas" className="absolute top-0 left-0 w-full h-full z-0"></canvas>
      
      {/* Set a transparent background to allow the Matrix effect to show through */}
      <div className="relative z-10 min-h-screen bg-black bg-opacity-50 pt-20 flex flex-col justify-center items-center">
      <h1 className="text-green-500 text-8xl font-vt323 bg-black bg-opacity-40 backdrop-blur-lg border border-opacity-30 border-green-500 p-4 rounded-lg">
  Senti's Sandbox
</h1>
  
        {/* Initial Loader */}
        {initialLoading ? (
            <div className="flex flex-col justify-center items-center mt-8">
              <p className="text-yellow-300 text-3xl font-vt323">
                Fetching your tokens<span>{loadingDots}</span>
              </p>
            </div>
          ) : (
<div className="relative grid mt-32 md:mt-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 items-start w-full bg-transparent py-10 px-4">
{currentTokens.map((token, index) => (
  <div
    key={index}
    className="w-full rounded-lg p-6 relative min-h-[440px] flex flex-col items-center"
    style={{
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Slightly transparent dark background
      border: "3px dotted #00FF00", // Fluorescent green dotted border
      color: "#00FF00", // Terminal green text
      backdropFilter: "blur(10px)", // Blur effect for the glassy look
      WebkitBackdropFilter: "blur(10px)", // For Safari compatibility
    }}
  >
    {/* First Row: Centered Image */}
    <div className="mb-4 flex flex-col items-center">
      <img
        src={token.token.image}
        alt={token.token.name}
        className="h-20 w-20 rounded-full border border-green-500 mb-4"
      />
      <h2 className="text-green-400 text-lg font-vt323 text-center">
        {token.token.name} $({token.token.symbol})
      </h2>
    </div>

    {/* Second Row: Contract Address and Market Cap */}
    <div className="text-center mb-6">
      <p className="text-green-400 font-vt323">
        CA: {token.token.mint.slice(0, 5)}...{token.token.mint.slice(-5)}
        <button
          onClick={() => copyToClipboard(token.token.mint)}
          className="ml-2 text-green-400 hover:text-green-500"
          aria-label="Copy Contract Address"
        >
          <FaCopy />
        </button>
      </p>
      <p className="text-green-400 font-vt323">
        Market Cap: $
        {token.pools[0]?.marketCap?.usd
          ? token.pools[0].marketCap.usd > 10000
            ? token.pools[0].marketCap.usd.toFixed(0).slice(0, 4) // Show only first 4 digits if above 10,000
            : token.pools[0].marketCap.usd.toFixed(2) // Otherwise, show full value
          : 'N/A'}
      </p>
    </div>

    {/* Third Row: Social Links */}
    <div className="flex justify-center mb-6 space-x-2">
      {token.token.twitter && (
        <a
          href={`https://${token.token.twitter}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-300 hover:text-green-500"
          title="Twitter"
        >
          <FaTwitter />
        </a>
      )}
      {token.token.telegram && (
        <a
          href={`https://${token.token.telegram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-300 hover:text-green-500"
          title="Telegram"
        >
          <FaTelegram />
        </a>
      )}
      {token.token.website && (
        <a
          href={`https://${token.token.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-300 hover:text-green-500"
          title="Website"
        >
          <FaGlobe />
        </a>
      )}
      {!(token.token.twitter || token.token.telegram || token.token.website) && (
        <span className="text-green-300"></span>
      )}
      <a
        href={`https://pump.fun/${token.token.mint}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-300 hover:text-green-500"
        title="Pump.fun"
      >
        <img src="/pfff.png" alt="Pump.fun" className="w-6 h-6" />
      </a>
    </div>

    {/* Owner Information */}
    <div className="text-center mb-6">
      <span className="font-vt323 text-green-400">Owner: </span>
      {typeof token.pools[0]?.deployer === 'string' ? (
        <>
          <span className="text-green-400 font-vt323">
            {token.pools[0].deployer.slice(0, 5)}...{token.pools[0].deployer.slice(-5)}
          </span>
          <button
            onClick={() => copyToClipboard(token.pools[0].deployer)}
            className="ml-2 text-green-400 hover:text-green-500"
            aria-label="Copy Owner Address"
          >
            <FaCopy />
          </button>
        </>
      ) : (
        <span className="text-green-400">N/A</span>
      )}
    </div>

    {/* Bottom Section: View Holders and View Score Buttons */}
    <div className="mt-auto flex justify-center items-center w-full">
  
      <button
        onClick={() => handleViewScore(token)}
        className="bg-green-300 text-black font-vt323 py-2 px-4 rounded"
        aria-label="View Score"
      >
        Analyse?
      </button>
    </div>

    {/* Conditionally Rendered Top Token Accounts
    {selectedToken === token.token.mint && holdersData.length > 0 && (
      <div className="mt-4">
        <h3 className="text-green-400 text-lg font-vt323 mb-2">Top Token Accounts</h3>
        <ul>
          {holdersData.map((holder, index) => (
            <li key={index} className="text-green-300 mb-2 font-vt323">
              <span className="font-vt323">
                {holder.address.slice(0, 5)}...{holder.address.slice(-5)}
              </span>
              {' '} {holder.percentage}% ({holder.uiAmountString})
              
              {index === 0 && (
                <span className="text-green-400 ml-2 font-vt323">(Bonding Curve)</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    )} */}
  </div>
))}




          {/* Pagination Buttons */}
          <div className="flex justify-center mt-8 font-vt323 space-x-4">
            <button
              onClick={prevPage}
              className={`px-4 py-2 text-white font-vt323 bg-green-300 rounded ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              className={`px-4 py-2 text-white bg-yellow-300 rounded ${
                currentPage >= Math.ceil(tokens.length / tokensPerPage)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              disabled={currentPage >= Math.ceil(tokens.length / tokensPerPage)}
            >
              Next
            </button>
          </div>
        </div>
        
      )}

      {/* Loader Component for Modal */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-green-400 text-lg font-vt323 flex flex-col items-center space-y-4">
            <p className="animate-pulse">{loadingMessage}</p>
          </div>
        </div>
      )}


      {/* Modal Component */}
      {showModal && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
    <div className="bg-black bg-opacity-30 backdrop-blur-lg text-white p-4 sm:p-6 rounded-lg w-full max-w-5xl mx-4 shadow-xl relative flex flex-col sm:flex-row font-vt323">
      {/* Close icon at the top-right corner */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl focus:outline-none"
        aria-label="Close Modal"
      >
        &times;
      </button>

      {/* Enhanced Image Section with Social Icons Below */}
      <div className="flex-shrink-0 p-4 bg-black bg-opacity-40 rounded-lg backdrop-blur-lg text-center">
        <img
          src={modalToken?.token?.image || "/default-image.png"}
          alt={modalToken?.token?.name || "Token Image"}
          className="w-36 h-36 object-cover rounded-full border-4 border-green-400 mb-4"
        />

        {/* Social Icons */}
        <div className="flex justify-center space-x-4 text-lg text-green-400 mt-4">
          {modalData?.telegram && (
            <a href={modalData.telegram} target="_blank" rel="noopener noreferrer" title="Telegram">
              <FaTelegram className="hover:text-white transition-colors duration-200" />
            </a>
          )}
          {modalData?.twitter && (
            <a href={modalData.twitter} target="_blank" rel="noopener noreferrer" title="Twitter">
              <FaTwitter className="hover:text-white transition-colors duration-200" />
            </a>
          )}
          {modalData?.website && (
            <a href={modalData.website} target="_blank" rel="noopener noreferrer" title="Website">
              <FaGlobe className="hover:text-white transition-colors duration-200" />
            </a>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="flex-grow p-4 sm:pl-8">
        <h2 className="text-2xl mb-4 text-green-400 text-center sm:text-left">Token Details</h2>

        {isLoading ? (
          <p className="text-center text-green-400 text-sm">Loading...</p>
        ) : (
          <>
            {/* Token Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-xs">
                <p><span className="font-semibold text-green-400">Token Name:</span> {modalToken?.token?.name || 'N/A'}</p>
              </div>
              <div className="text-xs">
              <p>
                      <span className="font-semibold text-green-400">Bundle:</span> 
                      {modalData?.message || 'No Bundle'} 
                      ({modalData?.samePercentages?.[0] !== undefined ? modalData.samePercentages[0] : 'Nil'}%)
                    </p>
              </div>
              <div className="text-xs">
                <p><span className="font-semibold text-green-400">Top 5 Distribution:</span> {modalData?.distro || 'N/A'}</p>
              </div>
            </div>

            {/* Top Owner Accounts */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-green-400">Top Holder Accounts:</p>
              <ul className="list-none">
                {modalData?.ownerAccounts?.length > 0 ? (
                  modalData.ownerAccounts.map((owner, index) => (
                    <li key={index} className="flex items-center text-xs">
                      {owner}
                      <a
                        href={`https://solscan.io/account/${owner}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-gray-400 hover:text-white"
                        title="Solscan"
                      >
                        <img src="/sols.png" alt="Solscan" className="w-4 h-4 inline" />
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="text-xs">No Holder accounts available</li>
                )}
              </ul>
            </div>
          </>
        )}

        <button
          onClick={() => setShowModal(false)}
          className="mt-6 bg-green-400 text-black py-2 px-4 sm:px-6 rounded hover:bg-green-500 transition-colors duration-300 shadow-md"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}




                </div>

    </div>
    </>

  );
};

export default CoinList;
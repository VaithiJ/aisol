

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/smartaudit/Navbar';
import { FaCopy, FaInfoCircle, FaTwitter, FaTelegram, FaGlobe } from 'react-icons/fa'; // Import social icons
import NavBar2 from '@/components/smartaudit/NavBar2.js';
import { GridBackgroundDemo } from '@/components/smartaudit/ui/GridDemo';

const CoinList = () => {
  const [tokens, setTokens] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tokensPerPage = 40;
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
    <div className="w-full min-h-screen bg-black pt-20 relative">
      <GridBackgroundDemo />
      <NavBar2 logo="/ps.png" />

      {/* Initial Loader */}
      {initialLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-300"></div>
        </div>
      ) : (
<div className="relative grid mt-32 md:mt-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 items-start w-full bg-black py-10 px-4">
{currentTokens.map((token, index) => (
            <div
              key={index}
              className="w-full border-4 rounded-lg moving-border bg-black p-6 relative min-h-[440px] flex flex-col"
            >
              {/* First Row: Image, Name, CA, MC */}
              <div className="flex flex-col items-center md:flex-row md:items-start mb-6">
                <img
                  src={token.token.image}
                  alt={token.token.name}
                  className="h-20 w-20 rounded-full"
                />
                <div className="mt-4 md:mt-0 md:ml-4 text-center md:text-left">
                  <h2 className="text-white text-lg font-bold">
                    {token.token.name} $({token.token.symbol})
                  </h2>
                  <div className="mt-2 flex justify-center md:justify-start space-x-2">
                    {/* Social Links */}
                    {token.token.twitter && (
                      <a
                        href={`https://${token.token.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white"
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
                        className="text-gray-400 hover:text-white"
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
                        className="text-gray-400 hover:text-white"
                        title="Website"
                      >
                        <FaGlobe />
                      </a>
                    )}
                    {!(token.token.twitter || token.token.telegram || token.token.website) && (
                      <span className="text-gray-400">No socials</span>
                    )}
                    <a
                      href={`https://pump.fun/${token.token.mint}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                      title="Pump.fun"
                    >
                      <img src="/pfff.png" alt="Pump.fun" className="w-6 h-6" />
                    </a>
                  </div>
                  <p className="text-gray-400 mt-2">
                    CA: {token.token.mint.slice(0, 5)}...{token.token.mint.slice(-5)}
                    <button
                      onClick={() => copyToClipboard(token.token.mint)}
                      className="ml-2 text-gray-400 hover:text-white"
                      aria-label="Copy Contract Address"
                    >
                      <FaCopy />
                    </button>
                  </p>
                  <p className="text-gray-400">
  Market Cap: ${token.pools[0]?.marketCap?.usd ? token.pools[0].marketCap.usd.toFixed(2) : 'N/A'}
</p>
                </div>
              </div>
      
              {/* Second Row: Owner Information */}
              <div className="mb-6">
                <span className="font-bold text-white">Owner: </span>
                {typeof token.pools[0]?.deployer === 'string' ? (
                  <>
                    <span className="text-gray-400">
                      {token.pools[0].deployer.slice(0, 5)}...{token.pools[0].deployer.slice(-5)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(token.pools[0].deployer)}
                      className="ml-2 text-gray-400 hover:text-white"
                      aria-label="Copy Owner Address"
                    >
                      <FaCopy />
                    </button>
                  </>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </div>
      
              {/* Third Row: Additional Details (Supply, OCT, HR, KOH) */}
              <div className="flex flex-col space-y-2 text-white text-sm mb-6">
                <div className="flex items-center">
                  <span className="font-bold">Supply: </span>
                  <span className="ml-2">{formatSupply(token.pools[0].tokenSupply, token.token.decimals)}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold">OCT: </span>
                  <span className="ml-2">{token.dct}</span>
                  <FaInfoCircle className="ml-1 text-gray-400 cursor-pointer hover:text-white" title="OCT: Owner Created Tokens" />
                </div>
                <div className="flex items-center">
                  <span className="font-bold">HR: </span>
                  <span className="ml-2">{token.hr}</span>
                  <FaInfoCircle className="ml-1 text-gray-400 cursor-pointer hover:text-white" title="HR: Hit Raydium" />
                </div>
                <div className="flex items-center">
                  <span className="font-bold">KOH: </span>
                  <span className="ml-2">{token.koh}</span>
                  <FaInfoCircle className="ml-1 text-gray-400 cursor-pointer hover:text-white" title="KOH: King of the Hill" />
                </div>
              </div>
      
              {/* Bottom Section: View Holders and View Score Buttons */}
              <div className="mt-auto flex justify-between items-center">
                <button
                  onClick={() => handleViewHolderPercentages(token.token.mint, token.pools[0].tokenSupply)}
                  className="text-yellow-300 hover:underline"
                  disabled={loadingToken === token.token.mint}
                >
                  {loadingToken === token.token.mint ? 'Fetching live data...' : 'View Holders %'}
                </button>
                
                {/* View Score Button moved to bottom-right */}
                <button
                  onClick={() => handleViewScore(token)}
                  className="bg-yellow-300 text-black font-bold py-2 px-4 rounded"
                  aria-label="View Score"
                >
                  View Score
                </button>
              </div>
      
              {/* Conditionally Rendered Top Token Accounts */}
              {selectedToken === token.token.mint && holdersData.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-white text-lg font-bold mb-2">Top Token Accounts</h3>
                  <ul>
                    {holdersData.map((holder, index) => (
                      <li key={index} className="text-gray-400 mb-2">
                        <span className="font-bold">
                          {holder.address.slice(0, 5)}...{holder.address.slice(-5)}
                        </span>
                        {' '} {holder.percentage}% ({holder.uiAmountString})
                        
                        {/* Conditionally show 'Bonding Curve' for index 0 */}
                        {index === 0 && (
                          <span className="text-green-400 ml-2">(Bonding Curve)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {/* Pagination Buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevPage}
              className={`px-4 py-2 text-white bg-yellow-300 rounded ${
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
          <div className="text-white text-lg font-bold">Loading...</div>
        </div>
      )}

      {/* Modal Component */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-black text-white p-4 sm:p-6 rounded-lg w-full max-w-5xl mx-4 shadow-xl relative">
            {/* Close icon at the top-right corner */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold focus:outline-none"
              aria-label="Close Modal"
            >
              &times;
            </button>
  
            <h2 className="text-lg sm:text-2xl font-bold mb-4 text-center text-green-400">Token Analysis</h2>
            {isLoading ? (
              <p className="text-center text-green-400 text-sm">Loading...</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="text-xs">
                    <p><span className="font-semibold text-green-400">Token Name:</span> {modalToken?.token?.name || 'N/A'}</p>
                  </div>
                  <div className="text-xs">
                    <p>
                      <span className="font-semibold text-green-400">Bundling Status:</span> 
                      {modalData?.message || 'N/A'} 
                      ({modalData?.samePercentages?.[0] !== undefined ? modalData.samePercentages[0] : 'N/A'}%)
                    </p>
                  </div>
                  <div className="text-xs">
                    <p><span className="font-semibold text-green-400">Telegram:</span> {modalData?.telegram ? 'Present' : 'Not Present'}</p>
                  </div>
                  <div className="text-xs">
                    <p><span className="font-semibold text-green-400">Twitter:</span> {modalData?.twitter ? 'Present' : 'Not Present'}</p>
                  </div>
                  <div className="text-xs">
                    <p><span className="font-semibold text-green-400">Website:</span> {modalData?.website ? 'Present' : 'Not Present'}</p>
                  </div>
                  <div className="text-xs">
                    <p><span className="font-semibold text-green-400">Top 5 Distribution:</span> {modalData?.distro || 'N/A'}</p>
                  </div>
                  <div className="text-xs">
                    <p><span className="font-semibold text-green-400">Life:</span> {modalData?.life || 'N/A'}</p>
                  </div>
                  {/* <div className="text-xs">
                    <p><span className="font-semibold text-green-400">Current Market Cap:</span> ${modalData?.marketCap !== undefined ? modalData.marketCap.toFixed(2) : 'N/A'}</p>
                  </div> */}
                </div>
  
                <div className="mt-6">
                  <p className="text-sm font-semibold text-green-400">Top Owner Accounts:</p>
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
                      <li className="text-xs">No owner accounts available</li>
                    )}
                  </ul>
                </div>
  
                <div className="absolute bottom-4 right-4 flex space-x-4">
                  <div className="text-sm sm:text-lg font-bold text-green-400 p-4 border-4 border-green-400 rounded-lg hover:bg-white hover:text-fluorescent-green transition-colors duration-300">
                    {modalData?.apeMessage || 'N/A'}
                  </div>
                  <div className="text-sm sm:text-xl font-bold text-green-400 p-4 border-4 border-green-400 rounded-lg hover:bg-white hover:text-black transition-colors duration-300">
                    Total Points: {modalData?.totalPoints !== undefined ? modalData.totalPoints : 'N/A'}/50
                  </div>
                </div>
              </>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 bg-green-400 text-black font-bold py-2 px-4 sm:px-6 rounded hover:bg-green-500 transition-colors duration-300 shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinList;
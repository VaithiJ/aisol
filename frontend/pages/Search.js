import React, { useState, useEffect } from "react";
import NavBar2 from '@/components/smartaudit/NavBar2.js';
import { GridBackgroundDemo } from '@/components/smartaudit/ui/GridDemo';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Renamed walletAddress to searchQuery
  const [tokenDetails, setTokenDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isSearchDisabled, setIsSearchDisabled] = useState(false);

  // Fetch token details based on the provided contract address (mint)
  const fetchTokenDetails = async (mint) => {
    const apiUrl = `/api/tokenDetails?mint=${mint}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching deployer tokens, status: ${response.status}`);
      }
      const data = await response.json();
      return data; // Assuming data contains all token details
    } catch (error) {
      console.error('Error fetching token details:', error);
      return null; // Return null in case of error
    }
  };

  // Handle the search operation
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      window.scrollTo({ top: 0, behavior: "smooth" });

      try {
        const tokenData = await fetchTokenDetails(searchQuery.trim());
        if (tokenData) {
          handleViewScore(tokenData);
        } else {
          console.error("Token data not found.");
        }
      } catch (error) {
        console.error("Error during search:", error);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsSearchDisabled(false); // Re-enable the search button when modal closes
  };

  // Handle viewing the token score/details
  const handleViewScore = async (token) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/calculateScoree`, {
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
    setTokenDetails(token);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-black pt-20 relative z-10">
      <GridBackgroundDemo className="z-0" />
      <NavBar2 className="relative z-10" logo="/ps.png" />

      {/* Form container */}
      <div className="flex justify-center items-center  h-screen relative z-20">
        <div className="w-full max-w-md p-10 mb-40 moving-border bg-transparent border-2 rounded-lg shadow-lgtransition-shadow duration-300" style={{ minHeight: '200px' }}>
          <h2 className="text-center text-xl font-semibold text-white mb-6">Enter Contract Address to Scan</h2>

          <input
            type="text"
            placeholder="Contract Address"
            value={searchQuery} // Changed from walletAddress
            onChange={(e) => setSearchQuery(e.target.value)} // Change handler
            className="w-full px-4 py-3 bg-transparent border border-yellow-400 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 mb-4"
          />

          <button
            onClick={handleSearch}
            className="w-full px-4 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors"
            disabled={isSearchDisabled}
          >
            {isSearchDisabled ? 'Scanning...' : 'Scan Token'}
          </button>
        </div>
      </div>
      {isLoading && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    <div className="text-white text-lg font-bold">Loading...</div>
  </div>
)}

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-black text-white p-4 sm:p-6 rounded-lg w-full max-w-5xl mx-4 shadow-xl relative">
            <button
              onClick={closeModal}
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
                    <p><span className="font-semibold text-green-400">Token Name:</span> {modalData?.name || 'N/A'}</p>
                  </div>
                  <div className="text-xs">
                    <p>
                      <span className="font-semibold text-green-400">Bundling Status:</span> 
                      {modalData?.message || 'Not bundled'} 
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
      
                <div className="mt-4"> {/* Added margin to separate the content from the buttons */}
                  <div className="flex space-x-4">
                    <div className="text-sm sm:text-lg font-bold text-green-400 p-4 border-4 border-green-400 rounded-lg hover:bg-white hover:text-fluorescent-green transition-colors duration-300">
                      {modalData?.apeMessage || 'N/A'}
                    </div>
                    <div className="text-sm sm:text-xl font-bold text-green-400 p-4 border-4 border-green-400 rounded-lg hover:bg-white hover:text-black transition-colors duration-300">
                      Total Points: {modalData?.totalPoints !== undefined ? modalData.totalPoints : 'N/A'}/50
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowModal(false)}
                className="bg-green-400 text-black font-bold py-2 px-4 sm:px-6 rounded hover:bg-green-500 transition-colors duration-300 shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;

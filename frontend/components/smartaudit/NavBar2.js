import React, { useState, useEffect } from "react";
import Link from "next/link";


const NavBar2 = ({ logo }) => {
  const [isSticky, setIsSticky] = useState(false);
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
 

  // Handle button clicks to set active state and perform actions
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);

    if (buttonName === "scanToken") {
      setIsModalOpen(true); // Open the modal when "Scan Token" is clicked
    }
    // Add more actions based on buttonName if needed
  };

  // Handle scrolling to show/hide the navbar
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }

        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);



  return (
    <>
     <nav
      id="navbar"
      className={`fixed top-0 left-0 w-full px-4 py-2 flex flex-col sm:flex-row justify-between items-center z-50 transition-transform duration-300 ${
        isSticky ? "bg-black bg-opacity-50 shadow-lg" : "bg-transparent"
      } ${showNavbar ? "translate-y-0" : "-translate-y-full"} backdrop-filter backdrop-blur-lg bg-opacity-70 bg-gradient-to-r from-black via-transparent to-black`}
      style={{
        borderBottom: isSticky ? "1px solid rgba(255, 255, 255, 0.2)" : "none",
      }}
    >
      <Link href="/">
        <img src={logo} alt="Your Logo" className="h-24 w-72 p-2 cursor-pointer" />
      </Link>

      {/* Navigation Buttons and Search */}
      <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4">
        {/* Screener Button */}
        <Link href="/Coins">
          <button
            onClick={() => handleButtonClick("screener")}
            className={`flex items-center justify-center border-2 border-luminous-green text-luminous-green font-semibold rounded-lg px-4 py-1.5 text-sm transition-all duration-300 ${
              activeButton === "screener"
                ? "bg-luminous-green/20 shadow-glow animate-glow-pulse"
                : "bg-transparent hover:bg-luminous-green/10 hover:shadow-lg transform hover:scale-105"
            }`}
            aria-label="Screener"
          >
            Screener
          </button>
        </Link>

        <Link href="/Search">
          <button
            onClick={() => handleButtonClick("scanToken")}
            className={`flex items-center justify-center border-2 border-luminous-green text-luminous-green font-semibold rounded-lg px-4 py-1.5 text-sm transition-all duration-300 ${
              activeButton === "scanToken"
                ? "bg-luminous-green/20 shadow-glow animate-glow-pulse"
                : "bg-transparent hover:bg-luminous-green/10 hover:shadow-lg transform hover:scale-105"
            }`}
            aria-label="Wallet Tracker"
          >
            Scan Token
          </button>
        </Link>


        {/* Wallet Tracker Button */}
        <Link href="/TrackWallet">
          <button
            onClick={() => handleButtonClick("walletTracker")}
            className={`flex items-center justify-center border-2 border-luminous-green text-luminous-green font-semibold rounded-lg px-4 py-1.5 text-sm transition-all duration-300 ${
              activeButton === "walletTracker"
                ? "bg-luminous-green/20 shadow-glow animate-glow-pulse"
                : "bg-transparent hover:bg-luminous-green/10 hover:shadow-lg transform hover:scale-105"
            }`}
            aria-label="Wallet Tracker"
          >
            Wallet Tracker
          </button>
        </Link>

    
    
      </div>


   
  
    </nav>
 



      </>
  );
};

export default NavBar2;

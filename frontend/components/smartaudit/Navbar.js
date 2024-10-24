import React, { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";

const Navbar = ({ logo }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);
  const [hasScrolledPastAbout, setHasScrolledPastAbout] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const handleScroll = () => {
        const aboutSection = document.getElementById("about");

        if (aboutSection) {
          const aboutSectionTop = aboutSection.getBoundingClientRect().top;

          if (window.scrollY > 10) {
            setIsSticky(true);
          } else {
            setIsSticky(false);
          }

          if (aboutSectionTop <= 0) {
            setHasScrolledPastAbout(true);
            setIsNavbarVisible(true);

            clearTimeout(timeoutId);
            const newTimeoutId = setTimeout(() => {
              setIsNavbarVisible(false);
            }, 1000);
            setTimeoutId(newTimeoutId);
          } else {
            setHasScrolledPastAbout(false);
            setIsNavbarVisible(true);
            clearTimeout(timeoutId);
          }
        }
      };

      const handleMouseEnter = () => {
        if (hasScrolledPastAbout) {
          setIsNavbarVisible(true);
          clearTimeout(timeoutId);
        }
      };

      const handleMouseLeave = () => {
        if (hasScrolledPastAbout) {
          const newTimeoutId = setTimeout(() => {
            setIsNavbarVisible(false);
          }, 1000);
          setTimeoutId(newTimeoutId);
        }
      };

      window.addEventListener("scroll", handleScroll);
      const navbar = document.getElementById("navbar");
      navbar.addEventListener("mouseenter", handleMouseEnter);
      navbar.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        navbar.removeEventListener("mouseenter", handleMouseEnter);
        navbar.removeEventListener("mouseleave", handleMouseLeave);
        clearTimeout(timeoutId);
      };
    }
  }, [isClient, timeoutId, hasScrolledPastAbout]);

  if (!isClient) return null;

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 w-full px-4 py-2 flex justify-between items-center z-30 transition-transform duration-300 ${isSticky ? "bg-black bg-opacity-10 shadow-lg" : "bg-transparent"} ${isNavbarVisible ? "translate-y-0" : "-translate-y-full"}`}
      style={{
        backdropFilter: isSticky ? "blur(10px)" : "none",
        borderBottom: isSticky ? "1px solid rgba(255, 255, 255, 0.2)" : "none",
      }}
    >
      <Link href="/">
        <p>
          <img src={logo} alt="Your Logo" className="h-20 w-auto p-2" />
        </p>
      </Link>
      <ul className="hidden md:flex space-x-12 list-none">
        <li>
          <ScrollLink
            to="home"
            smooth={true}
            duration={800}
            offset={-70}
          >
            <p className="text-white hover:text-[#DFC03E] font-medium cursor-pointer">Home</p>
          </ScrollLink>
        </li>
        <li>
          <ScrollLink
            to="about"
            smooth={true}
            duration={800}
            offset={-70}
          >
            <p className="text-white hover:text-[#DFC03E] font-medium cursor-pointer">About</p>
          </ScrollLink>
        </li>
        <li>
          <ScrollLink
            to="why"
            smooth={true}
            duration={800}
            offset={-70}
          >
            <p className="text-white hover:text-[#DFC03E] font-medium cursor-pointer">Why Us?</p>
          </ScrollLink>
        </li>
      
        <li>
          <Link href="/Coins">
            <p className="text-white hover:text-[#DFC03E] font-medium cursor-pointer">Screener</p>
          </Link>
        </li>
        <li>
          <Link href="/Search">
            <p className="text-white hover:text-[#DFC03E] font-medium cursor-pointer">Scan Token</p>
          </Link>
        </li>
        <li>
          <Link href="/TrackWallet">
            <p className="text-white hover:text-[#DFC03E] font-medium cursor-pointer">Wallet Tracker</p>
          </Link>
        </li>
   
      
        {/* <li>
          <a
            href="https://drive.google.com/file/d/11BuM2dQpIwzjztYjF7d5CpLWqTgmhU64/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-white hover:text-[#DFC03E] font-medium cursor-pointer">Whitepaper</p>
          </a>
        </li> */}
      </ul>
    </nav>
  );
};

export default Navbar;

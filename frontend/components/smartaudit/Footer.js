import React from 'react';
import { FaTwitter, FaTelegramPlane } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="text-gray-600 bg-black z-10 relative">
      <div className="container px-5 py-4 mx-auto flex items-center sm:flex-row flex-col">
        <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
          <img
            src="/ps.png"
            className="h-16"
            alt="PumpScanner Logo"
          />
        </a>
        <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4 font2">
          © 2024 PumpScanner
        </p>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start z-20">
          <a href="https://x.com/PumpScanner?t=iii8jv233lz-fcSaXJgwnw&s=09" className="ml-3 text-gray-500" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="w-5 h-5" />
          </a>
      
        </span>
      </div>
    </footer>
  );
};

export default Footer;

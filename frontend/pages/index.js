import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import Navbar from '@/components/smartaudit/Navbar';
import { GridBackgroundDemo } from '@/components/smartaudit/ui/GridDemo';
import Why from '@/components/smartaudit/why';
import About from '@/components/smartaudit/About';
import Footer from '@/components/smartaudit/Footer';
import Link from 'next/link';
import { useRouter } from 'next/router';


const CardWithImageBackground = ({ image }) => {
  return (
    <div className="relative flex justify-center items-center">
      <div
        className="neon-card w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden bg-cover bg-center shadow-lg"
        style={{ backgroundImage: `url(${image})` }}
      >
        {/* Add any additional content here if needed */}
      </div>
    </div>
  );
};

// const handleWhitepaperClick = () => {
//   window.open('https://pumpscanner.gitbook.io/pumpscanner-documentation/', '_blank');
// };
// const router = useRouter();

// const handleScanclick = () => {
//   router.push('/Search');
// };

const Onepage = () => {
  const router = useRouter(); // Move useRouter inside the functional component

  const handleWhitepaperClick = () => {
    window.open('https://pumpscanner.gitbook.io/pumpscanner-documentation/', '_blank');
  };

  const handleScanclick = () => {
    router.push('/Search');
  };

  const handleScreenclick = () =>{
    router.push("/Coins")
  }


  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
        <GridBackgroundDemo />
        <div id="home" className="absolute inset-0 flex flex-col h-full z-40">
          <Navbar className="z-20 relative" logo="ps.png" /> {/* Replace with your logo path */}
          <div className="flex flex-col md:flex-row items-center justify-between flex-grow text-blue-900 px-4 sm:px-8 md:px-12 lg:px-24">
            {/* Text Content */}
            <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 text-white drop-shadow-lg">
                PumpScanner
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white drop-shadow-lg mb-4">
                Let's make{' '}
                <span className="text-[#DFC03E]">
                  <Typewriter
                    words={['Solana', 'Pumpfun']}
                    loop={0}
                    cursor
                    cursorStyle="|"
                    typeSpeed={100}
                    deleteSpeed={50}
                    delaySpeed={2000}
                  />
                </span>{' '}
                <br /> great again.
              </p>
              {/* Buttons Container */}
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Whitepaper Button */}
                <button
                  className="Documents-btn flex items-center justify-center bg-[#8F88C2] hover:bg-[#5C52A2] text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                  onClick={handleWhitepaperClick}
                >
                  <span className="folderContainer relative">
                    {/* SVG Icons */}
                    <svg
                      className="fileBack absolute top-0 left-0 w-6 h-6"
                      width={146}
                      height={113}
                      viewBox="0 0 146 113"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 4C0 1.79086 1.79086 0 4 0H50.3802C51.8285 0 53.2056 0.627965 54.1553 1.72142L64.3303 13.4371C65.2799 14.5306 66.657 15.1585 68.1053 15.1585H141.509C143.718 15.1585 145.509 16.9494 145.509 19.1585V109C145.509 111.209 143.718 113 141.509 113H3.99999C1.79085 113 0 111.209 0 109V4Z"
                        fill="url(#paint0_linear_117_4)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_117_4"
                          x1={0}
                          y1={0}
                          x2="72.93"
                          y2="95.4804"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#8F88C2" />
                          <stop offset={1} stopColor="#5C52A2" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <svg
                      className="filePage absolute top-0 left-0 w-4 h-4"
                      width={88}
                      height={99}
                      viewBox="0 0 88 99"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width={88} height={99} fill="url(#paint0_linear_117_6)" />
                      <defs>
                        <linearGradient
                          id="paint0_linear_117_6"
                          x1={0}
                          y1={0}
                          x2={81}
                          y2="160.5"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="white" />
                          <stop offset={1} stopColor="#686868" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <svg
                      className="fileFront absolute top-0 left-0 w-8 h-4"
                      width={160}
                      height={79}
                      viewBox="0 0 160 79"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.29306 12.2478C0.133905 9.38186 2.41499 6.97059 5.28537 6.97059H30.419H58.1902C59.5751 6.97059 60.9288 6.55982 62.0802 5.79025L68.977 1.18034C70.1283 0.410771 71.482 0 72.8669 0H77H155.462C157.87 0 159.733 2.1129 159.43 4.50232L150.443 75.5023C150.19 77.5013 148.489 79 146.474 79H7.78403C5.66106 79 3.9079 77.3415 3.79019 75.2218L0.29306 12.2478Z"
                        fill="url(#paint0_linear_117_5)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_117_5"
                          x1="38.7619"
                          y1="8.71323"
                          x2="66.9106"
                          y2="82.8317"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#C3BBFF" />
                          <stop offset={1} stopColor="#51469A" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  <p className="ml-2">WHITEPAPER</p>
                </button>

                {/* Screener Button */}
                <button
                  className="Documents-btn flex items-center justify-center bg-[#8F88C2] hover:bg-[#5C52A2] text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                  onClick={handleScreenclick}
                >
                  <span className="folderContainer relative">
                    {/* SVG Icons */}
                    <svg
                      className="fileBack absolute top-0 left-0 w-6 h-6"
                      width={146}
                      height={113}
                      viewBox="0 0 146 113"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 4C0 1.79086 1.79086 0 4 0H50.3802C51.8285 0 53.2056 0.627965 54.1553 1.72142L64.3303 13.4371C65.2799 14.5306 66.657 15.1585 68.1053 15.1585H141.509C143.718 15.1585 145.509 16.9494 145.509 19.1585V109C145.509 111.209 143.718 113 141.509 113H3.99999C1.79085 113 0 111.209 0 109V4Z"
                        fill="url(#paint0_linear_117_4)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_117_4"
                          x1={0}
                          y1={0}
                          x2="72.93"
                          y2="95.4804"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#8F88C2" />
                          <stop offset={1} stopColor="#5C52A2" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <svg
                      className="filePage absolute top-0 left-0 w-4 h-4"
                      width={88}
                      height={99}
                      viewBox="0 0 88 99"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width={88} height={99} fill="url(#paint0_linear_117_6)" />
                      <defs>
                        <linearGradient
                          id="paint0_linear_117_6"
                          x1={0}
                          y1={0}
                          x2={81}
                          y2="160.5"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="white" />
                          <stop offset={1} stopColor="#686868" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <svg
                      className="fileFront absolute top-0 left-0 w-8 h-4"
                      width={160}
                      height={79}
                      viewBox="0 0 160 79"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.29306 12.2478C0.133905 9.38186 2.41499 6.97059 5.28537 6.97059H30.419H58.1902C59.5751 6.97059 60.9288 6.55982 62.0802 5.79025L68.977 1.18034C70.1283 0.410771 71.482 0 72.8669 0H77H155.462C157.87 0 159.733 2.1129 159.43 4.50232L150.443 75.5023C150.19 77.5013 148.489 79 146.474 79H7.78403C5.66106 79 3.9079 77.3415 3.79019 75.2218L0.29306 12.2478Z"
                        fill="url(#paint0_linear_117_5)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_117_5"
                          x1="38.7619"
                          y1="8.71323"
                          x2="66.9106"
                          y2="82.8317"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#C3BBFF" />
                          <stop offset={1} stopColor="#51469A" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  <p className="ml-2">SCREENER</p>
                </button>
                <button
                  className="Documents-btn flex items-center justify-center bg-[#8F88C2] hover:bg-[#5C52A2] text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                  onClick={handleScanclick}
                >
                  <span className="folderContainer relative">
                    {/* SVG Icons */}
                    <svg
                      className="fileBack absolute top-0 left-0 w-6 h-6"
                      width={146}
                      height={113}
                      viewBox="0 0 146 113"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 4C0 1.79086 1.79086 0 4 0H50.3802C51.8285 0 53.2056 0.627965 54.1553 1.72142L64.3303 13.4371C65.2799 14.5306 66.657 15.1585 68.1053 15.1585H141.509C143.718 15.1585 145.509 16.9494 145.509 19.1585V109C145.509 111.209 143.718 113 141.509 113H3.99999C1.79085 113 0 111.209 0 109V4Z"
                        fill="url(#paint0_linear_117_4)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_117_4"
                          x1={0}
                          y1={0}
                          x2="72.93"
                          y2="95.4804"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#8F88C2" />
                          <stop offset={1} stopColor="#5C52A2" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <svg
                      className="filePage absolute top-0 left-0 w-4 h-4"
                      width={88}
                      height={99}
                      viewBox="0 0 88 99"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width={88} height={99} fill="url(#paint0_linear_117_6)" />
                      <defs>
                        <linearGradient
                          id="paint0_linear_117_6"
                          x1={0}
                          y1={0}
                          x2={81}
                          y2="160.5"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="white" />
                          <stop offset={1} stopColor="#686868" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <svg
                      className="fileFront absolute top-0 left-0 w-8 h-4"
                      width={160}
                      height={79}
                      viewBox="0 0 160 79"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.29306 12.2478C0.133905 9.38186 2.41499 6.97059 5.28537 6.97059H30.419H58.1902C59.5751 6.97059 60.9288 6.55982 62.0802 5.79025L68.977 1.18034C70.1283 0.410771 71.482 0 72.8669 0H77H155.462C157.87 0 159.733 2.1129 159.43 4.50232L150.443 75.5023C150.19 77.5013 148.489 79 146.474 79H7.78403C5.66106 79 3.9079 77.3415 3.79019 75.2218L0.29306 12.2478Z"
                        fill="url(#paint0_linear_117_5)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_117_5"
                          x1="38.7619"
                          y1="8.71323"
                          x2="66.9106"
                          y2="82.8317"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#C3BBFF" />
                          <stop offset={1} stopColor="#51469A" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  <p className="ml-2">SCAN</p>
                </button>
              </div>
            </div>
            {/* Image Card */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0">
              <CardWithImageBackground image="/home.jpg" /> {/* Replace with your image path */}
            </div>
          </div>
        </div>
      </div>
      
      {/* Other Sections */}
      <div className="py-12 bg-gray-900">
        <About />
      </div>
      <div className="py-12 bg-gray-900">
        <Why />
      </div>

      
      {/* Footer */}
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default Onepage;

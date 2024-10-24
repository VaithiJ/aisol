// import React from "react";

// export function GridBackgroundDemo() {
//   return (
//     <div className="fixed inset-0 w-full h-full bg-black flex items-center justify-center z-0">
//       {/* Radial gradient for the container to give a faded look */}
//       <div className="absolute inset-0 flex items-center justify-center pointer-events-none dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] bg-grid-black/[0.2] dark:bg-grid-white/[0.2] group"></div>
     
//       {/* Adding the hover effect */}
//       <style jsx>{`
//         .group:hover .bg-grid-black\\/[0\\.2],
//         .group:hover .dark\\:bg-grid-white\\/[0\\.2] {
//           animation: gridHover 2s infinite;
//         }
//       `}</style>
//     </div>
//   );
// }

import React from "react";


export function GridBackgroundDemo() {
  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center z-0">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
    </div>
  );
}




import { useEffect } from 'react';

const MatrixEffect = () => {
  useEffect(() => {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');

    // Reduce character set for a retro feel
    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    let fontSize = 20; // Base font size for retro look
    let columns = canvas.width / fontSize;
    let drops = Array(Math.floor(columns)).fill(1);

    const adjustCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      fontSize = Math.max(16, window.innerWidth / 40); // Adjust font size for different screen sizes
      columns = canvas.width / fontSize;
      drops = Array(Math.floor(columns)).fill(1);
    };

    window.addEventListener('resize', adjustCanvasSize);
    adjustCanvasSize();

    function drawMatrix() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Slightly transparent background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00FF00'; // Fluorescent green color
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Limit character drops to enhance the retro feel
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Slow down the drops and reduce frequency
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) { // Less frequent drop reset
          drops[i] = 0; 
        }

        drops[i] += Math.random() > 0.9 ? 1 : 0; // Slow down the falling
      }

      requestAnimationFrame(drawMatrix); // Smooth animation
    }

    drawMatrix();

    return () => {
      window.removeEventListener('resize', adjustCanvasSize);
    };
  }, []);

  return (
    <canvas
      id="matrixCanvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, // Ensure it stays in the background
      }}
    />
  );
};

export default MatrixEffect;

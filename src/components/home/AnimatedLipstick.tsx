import React, { useState } from 'react';

interface AnimatedCosmeticProps {
  type: 'lipstick' | 'palette' | 'foundation';
}

const AnimatedCosmetic: React.FC<AnimatedCosmeticProps> = ({ type }) => {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX - window.innerWidth / 2) / 100;
    const y = (e.clientY - window.innerHeight / 2) / 100;
    setParallax({ x, y });
  };

  let imageUrl = '';
  switch (type) {
    case 'lipstick':
      imageUrl = '/lipstick.png'; // Replace with your lipstick image URL
      break;
    case 'palette':
      imageUrl = '/palette.png'; // Replace with your palette image URL
      break;
    case 'foundation':
      imageUrl = '/foundation.png'; // Replace with your foundation image URL
      break;
    default:
      imageUrl = '/placeholder.png';
  }

  return (
    <div
      style={{
        width: '400px',
        height: '400px',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: `translate(${parallax.x}px, ${parallax.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
      onMouseMove={handleMouseMove}
    />
  );
};

export default AnimatedCosmetic;

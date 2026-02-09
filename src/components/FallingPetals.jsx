import { useEffect, useState } from 'react';

const petalColors = [
  'rgba(225, 173, 173, 0.8)',  // Dusty rose
  'rgba(240, 206, 206, 0.8)', // Light pink
  'rgba(255, 218, 218, 0.7)', // Soft pink
  'rgba(178, 172, 136, 0.6)', // Sage
  'rgba(200, 196, 165, 0.6)', // Light sage
];

const createPetal = (id) => {
  const size = 12 + Math.random() * 18;
  const left = Math.random() * 100;
  const delay = Math.random() * 8;
  const duration = 8 + Math.random() * 8;
  const swayDuration = 3 + Math.random() * 3;
  const color = petalColors[Math.floor(Math.random() * petalColors.length)];
  const rotation = Math.random() * 360;

  return {
    id,
    size,
    left,
    delay,
    duration,
    swayDuration,
    color,
    rotation,
  };
};

// Initialize petals outside component to avoid recreating on each render
const createInitialPetals = () => 
  Array.from({ length: 25 }, (_, i) => createPetal(i));

export default function FallingPetals() {
  const [petals, setPetals] = useState(createInitialPetals);

  useEffect(() => {

    // Continuously add new petals
    const interval = setInterval(() => {
      setPetals((prev) => {
        const newId = Date.now() + Math.random();
        const newPetals = [...prev, createPetal(newId)];
        // Keep only last 40 petals for performance
        return newPetals.slice(-40);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal"
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            animationDuration: `${petal.duration}s, ${petal.swayDuration}s`,
            animationDelay: `${petal.delay}s, ${petal.delay}s`,
            transform: `rotate(${petal.rotation}deg)`,
          }}
        >
          {/* Petal SVG */}
          <svg
            viewBox="0 0 24 24"
            fill={petal.color}
            style={{ 
              width: '100%', 
              height: '100%',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          >
            <path d="M12 2C12 2 6 8 6 14C6 17.5 8.5 20 12 20C15.5 20 18 17.5 18 14C18 8 12 2 12 2Z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

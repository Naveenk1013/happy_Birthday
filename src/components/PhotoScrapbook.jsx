import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

// Actual images from public/images folder with beautiful aesthetic quotes
const photoImages = [
  { id: 1, src: '/images/image00.png', label: 'The twinkle in your eyes' },
  { id: 2, src: '/images/image1.png', label: 'Your smile is my favorite view' },
  { id: 3, src: '/images/image2.png', label: 'Life is better with you, Nandini' },
  { id: 4, src: '/images/image3.png', label: 'Sweet as a summer peach' },
  { id: 5, src: '/images/image4.png', label: 'Dream big, sparkle more' },
  { id: 6, src: '/images/image5.png', label: 'Wild heart, softest soul' },
  { id: 7, src: '/images/image6.png', label: 'Magic in every shared moment' },
  { id: 8, src: '/images/image7.png', label: 'Moonlight, roses, and YOU' },
  { id: 9, src: '/images/image8.png', label: 'Kind heart, brave spirit' },
  { id: 10, src: '/images/image9.png', label: 'A beautiful soul, inside and out' },
  { id: 11, src: '/images/image10.png', label: 'Nandini, you are one of a kind' },
  { id: 12, src: '/images/image11.png', label: 'Graceful and ever so elegant' },
  { id: 13, src: '/images/image12.png', label: 'Every memory with you is a treasure' },
];

// Pre-compute deterministic rotations and positions
const getRotation = (index) => {
  const rotations = [-12, 8, -5, 15, -8, 10, -15, 6, -10, 12, -7, 14, -9];
  return rotations[index % rotations.length];
};

const getPosition = (index) => {
  const cols = 4;
  const row = Math.floor(index / cols);
  const col = index % cols;
  const baseX = (col - 1.5) * 125;
  const baseY = (row - 1) * 145;
  const offsets = [
    { x: 15, y: -10 }, { x: -20, y: 8 }, { x: 10, y: 15 }, { x: -15, y: -12 },
    { x: 8, y: 20 }, { x: -10, y: -5 }, { x: 18, y: 10 }, { x: -8, y: -18 },
    { x: 12, y: 5 }, { x: -15, y: 12 }, { x: 5, y: -15 }, { x: -12, y: 8 },
    { x: 10, y: -8 },
  ];
  return {
    x: baseX + offsets[index % offsets.length].x,
    y: baseY + offsets[index % offsets.length].y,
  };
};

// Pre-compute photo data at module level
const initialPhotos = photoImages.map((img, index) => {
  const rotation = getRotation(index);
  const position = getPosition(index, photoImages.length);
  return {
    ...img,
    rotation,
    position,
    zIndex: index + 1,
    // Pre-compute entrance offsets for purity
    entranceOffset: {
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 600,
    }
  };
});

export default function PhotoScrapbook() {
  const [photos, setPhotos] = useState(initialPhotos);
  const [maxZ, setMaxZ] = useState(photoImages.length);

  const bringToFront = (id) => {
    setMaxZ((prev) => prev + 1);
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === id ? { ...photo, zIndex: maxZ + 1 } : photo
      )
    );
  };

  return (
    <div className="relative w-full min-h-[600px] md:min-h-[750px] flex items-center justify-center py-6">
      {/* Container for the pile */}
      <div className="relative w-[500px] h-[500px] md:w-[650px] md:h-[600px]">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            className="polaroid absolute w-[130px] md:w-[160px]"
            style={{
              left: '50%',
              top: '50%',
              zIndex: photo.zIndex,
              rotate: photo.rotation,
            }}
            initial={{
              x: photo.position.x - 65 + photo.entranceOffset.x,
              y: photo.position.y - 80 + photo.entranceOffset.y,
              opacity: 0,
              scale: 0.5,
              rotate: photo.rotation + 90,
            }}
            animate={{
              x: photo.position.x - 65,
              y: photo.position.y - 80,
              opacity: 1,
              scale: 1,
              rotate: photo.rotation,
            }}
            transition={{
              type: 'spring',
              stiffness: 60,
              damping: 15,
              delay: 1.5 + (index * 0.3), // Staggered reveal
            }}
            drag
            dragConstraints={{
              left: -400,
              right: 400,
              top: -400,
              bottom: 400,
            }}
            dragElastic={0.1}
            onDragStart={() => bringToFront(photo.id)}
            whileDrag={{ scale: 1.15, cursor: 'grabbing', zIndex: 999 }}
            whileHover={{ scale: 1.05, y: -10 }}
          >
            {/* Top white strip for polaroid look */}
            <div className="w-full aspect-[4/5] rounded-sm overflow-hidden bg-gray-50">
              <img
                src={photo.src}
                alt={photo.label}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            {/* Caption area with pretty quotes */}
            <div
              className="h-[35px] flex items-center justify-center text-[#8a866a] px-1 text-center"
              style={{ fontFamily: "'Great Vibes', cursive", fontSize: '15px' }}
            >
              {photo.label} ♡
            </div>
          </motion.div>
        ))}
      </div>

      {/* Instructions */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 + (photoImages.length * 0.3) + 1 }}
      >
        <p
          className="text-[#8a866a] text-lg italic"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          ✨ These memories are just for you ✨
        </p>
      </motion.div>
    </div>
  );
}

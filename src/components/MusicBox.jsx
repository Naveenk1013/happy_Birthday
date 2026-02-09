import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Disc3 } from 'lucide-react';
import Ballpit from './Ballpit';

// Pre-computed decorative element positions
const DECORATIVE_ELEMENTS = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  background: i % 2 === 0 ? '#E1ADAD' : '#B2AC88',
  left: `${(i * 17 + 10) % 100}%`,  // Deterministic but spread out
  top: `${(i * 23 + 5) % 100}%`,
  duration: 4 + i,
  delay: i * 0.5,
}));

export default function MusicBox({ onOpen }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      onOpen();
    }
  }, [countdown, onOpen]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{
          background: 'linear-gradient(135deg, #FDF6E3 0%, #f5ead0 50%, #c8c4a5 100%)'
        }}
        initial={{ opacity: 1 }}
        exit={{ 
          opacity: 0,
          scale: 1.5,
          filter: 'blur(20px)'
        }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        {/* Interactive Ballpit Background */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <Ballpit
            count={40}
            gravity={0.03}
            friction={0.99}
            wallBounce={0.8}
            followCursor={true}
            colors={['#E1ADAD', '#B2AC88', '#FDF6E3', '#d19a9a', '#8a866a']}
            minSize={0.7}
            maxSize={1.5}
          />
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {DECORATIVE_ELEMENTS.map((elem) => (
            <motion.div
              key={elem.id}
              className="absolute w-32 h-32 rounded-full opacity-20"
              style={{
                background: elem.background,
                left: elem.left,
                top: elem.top,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.25, 0.1]
              }}
              transition={{
                duration: elem.duration,
                repeat: Infinity,
                delay: elem.delay
              }}
            />
          ))}
        </div>

        <motion.div
          className="text-center relative z-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Title */}
          <motion.h1
            className="text-5xl md:text-7xl mb-4"
            style={{ 
              fontFamily: "'Great Vibes', cursive",
              color: '#c88a8a'
            }}
            animate={{ 
              textShadow: [
                '0 0 20px rgba(225, 173, 173, 0.3)',
                '0 0 40px rgba(225, 173, 173, 0.5)',
                '0 0 20px rgba(225, 173, 173, 0.3)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            A Special Day
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-12 text-[#8a866a]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            the celebration begins in...
          </motion.p>

          {/* Countdown Display */}
          <div className="flex items-center justify-center h-48">
            <AnimatePresence mode="wait">
              <motion.div
                key={countdown}
                initial={{ scale: 0, opacity: 0, rotate: -20 }}
                animate={{ scale: 1.5, opacity: 1, rotate: 0 }}
                exit={{ scale: 3, opacity: 0, rotate: 20 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="text-8xl md:text-9xl font-bold text-[#c88a8a]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {countdown}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Succinct indicator */}
          <motion.p
            className="mt-8 text-[#B2AC88] text-lg italic"
            style={{ fontFamily: "'Playfair Display', serif" }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Get ready, Nandini! ✨
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

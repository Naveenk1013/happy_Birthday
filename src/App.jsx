import { useState, useRef, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import MusicBox from './components/MusicBox';
import BirthdayCake from './components/BirthdayCake';
import FallingPetals from './components/FallingPetals';
import PhotoScrapbook from './components/PhotoScrapbook';
import Grainient from './components/Grainient';
import Ballpit from './components/Ballpit';
import { Heart, Sparkles, Gift } from 'lucide-react';
import './index.css';

function App() {
  const [isCandlesOut, setIsCandlesOut] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const audioRef = useRef(null);

  // Initialize audio at App level so it persists across transitions
  useEffect(() => {
    // We only load audio - we'll play it after user interaction (blowing candles or clicking)
    audioRef.current = new Audio('/audio/HAPPYBIRTHDAY.m4a');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.6;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleMusicBoxOpen = async () => {
    // Start music when opening the box
    try {
      if (audioRef.current) {
        await audioRef.current.play();
      }
    } catch (error) {
      console.log('Audio playback requires user interaction:', error);
    }
    setIsOpened(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FDF6E3]">
      {/* Dynamic Gradient Background */}
      <div className="fixed inset-0 z-0">
        <Grainient
          color1="#FDF6E3" // Cream
          color2="#E1ADAD" // Dusty Rose
          color3="#B2AC88" // Sage Green
          timeSpeed={0.15}
          zoom={0.8}
          warpStrength={0.5}
          grainAmount={0.05}
        />
      </div>

      {/* Interactive Balloons (Ballpit) - Persistent for main scene */}
      {isOpened && (
        <div className="fixed inset-0 z-10 opacity-60 pointer-events-none md:pointer-events-auto">
          <Ballpit
            count={60}
            gravity={0.02}
            friction={0.998}
            wallBounce={0.9}
            followCursor={true}
            colors={['#E1ADAD', '#B2AC88', '#FDF6E3', '#f0cece', '#d4cfb5']}
            minSize={0.6}
            maxSize={1.4}
          />
        </div>
      )}

      {/* Interactive Intro: Blowing Candles */}
      <AnimatePresence>
        {!isCandlesOut && (
          <BirthdayCake onComplete={() => setIsCandlesOut(true)} />
        )}
      </AnimatePresence>

      {/* Music Box Landing */}
      <AnimatePresence>
        {isCandlesOut && !isOpened && (
          <MusicBox onOpen={handleMusicBoxOpen} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {isCandlesOut && isOpened && (
          <motion.div
            key="main-content"
            className="relative z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Falling Petals Background */}
            <FallingPetals />

            {/* Header */}
            <motion.header
              className="pt-6 pb-4 text-center relative z-30"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div
                className="flex items-center justify-center gap-3 mb-2"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 text-[#E1ADAD]" />
                <Heart className="w-6 h-6 text-[#c88a8a] fill-current" />
                <Sparkles className="w-8 h-8 text-[#E1ADAD]" />
              </motion.div>

              <motion.h1
                className="text-6xl md:text-8xl mb-2"
                style={{ 
                  fontFamily: "'Great Vibes', cursive",
                  color: '#c88a8a',
                  textShadow: '0 4px 20px rgba(225, 173, 173, 0.3)'
                }}
              >
                Happy Birthday
              </motion.h1>

              <motion.h2
                className="text-4xl md:text-5xl"
                style={{ 
                  fontFamily: "'Playfair Display', serif",
                  color: '#8a866a',
                  fontWeight: 500
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                Nandini Anand
              </motion.h2>

              <motion.div
                className="mt-3 flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <Gift className="w-5 h-5 text-[#B2AC88]" />
                <p
                  className="text-[#B2AC88] text-lg italic"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Wishing you a day as beautiful as you are
                </p>
                <Gift className="w-5 h-5 text-[#B2AC88]" />
              </motion.div>
            </motion.header>

            {/* Photo Scrapbook Section */}
            <motion.section
              className="relative z-30 py-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <h3
                className="text-3xl md:text-4xl text-center mb-3 text-[#c88a8a]"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Precious Memories
              </h3>
              <PhotoScrapbook />
            </motion.section>

            {/* Footer */}
            <motion.footer
              className="text-center py-12 relative z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <motion.div
                className="flex items-center justify-center gap-3"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-[#E1ADAD] fill-current" />
                <p
                  className="text-[#8a866a] text-sm"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  ✨ Celebrate You ✨
                </p>
                <Heart className="w-4 h-4 text-[#E1ADAD] fill-current" />
              </motion.div>
              <p
                className="mt-4 text-[#c88a8a] text-2xl"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Aur Ha Ek Aur Baat Nanni Moti Lag Rahi ho!!!
              </p>
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

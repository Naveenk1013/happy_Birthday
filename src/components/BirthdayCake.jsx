import { useState, useEffect, useRef, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Wind } from 'lucide-react';

const Flower = ({ cx, cy, r, colors, delay = 0 }) => (
  <motion.g
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, type: 'spring', stiffness: 100 }}
  >
    {colors.map((color, i) => (
      <circle 
        key={i} 
        cx={cx} 
        cy={cy} 
        r={r - i * (r / colors.length)} 
        fill={color} 
      />
    ))}
  </motion.g>
);

const birthdayMessage = `Happy Birthday, Nandini! 🌸

On your special day, I wish you all the happiness, safety, and peace in the world. You deserve a life filled with nothing but tranquility and joy.

I also wanted to say... I know we might not talk on a regular basis anymore, but please don't ever think that I’ve changed or that I don't want to talk to you. It's nothing like that at all. You still hold the same place in my thoughts.

Have a wonderful day, Nandini! 💐✨`;

export default function BirthdayCake({ onComplete }) {
  const [candlesOut, setCandlesOut] = useState([false, false, false, false, false]);
  const [step, setStep] = useState(1); // 1: Initial blow, 2: Blow harder, 3: Success/Message
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingRef = useRef(null);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const requestRef = useRef(null);
  const volumeRef = useRef(0);

  const startTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      let index = 0;
      typingRef.current = setInterval(() => {
        if (index < birthdayMessage.length) {
          setDisplayedText(birthdayMessage.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typingRef.current);
          // Wait a few seconds after typing finishes before transitioning
          setTimeout(() => {
            onComplete();
          }, 3500);
        }
      }, 30);
    }
  }, [isTyping, onComplete]);

  const handleBlow = useCallback(() => {
    if (step === 1) {
      setCandlesOut([true, true, false, true, true]);
      setStep(2);
    } else if (step === 2 && volumeRef.current > 65) {
      setCandlesOut([true, true, true, true, true]);
      setStep(3);
      startTyping();
    }
  }, [step, startTyping]);

  useEffect(() => {
    if (step === 3) return; // Stop listening once all out
    
    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

        const checkVolume = () => {
          if (step === 3) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let values = 0;
          for (let i = 0; i < dataArray.length; i++) values += dataArray[i];
          const average = values / dataArray.length;
          volumeRef.current = average;
          if (average > 45) handleBlow();
          requestRef.current = requestAnimationFrame(checkVolume);
        };
        checkVolume();
      } catch {
        // Silently fail or handle error if needed
        setPermissionDenied(true);
      }
    };
    initAudio();
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [handleBlow, step]);

  const skipMicrophone = () => {
    if (step === 1) {
      setCandlesOut([true, true, false, true, true]);
      setStep(2);
    } else if (step === 2) {
      setCandlesOut([true, true, true, true, true]);
      setStep(3);
      startTyping();
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDF6E3] overflow-y-auto py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
    >
      <div className="text-center mb-8 px-6">
        <motion.h1 
          className="text-4xl md:text-5xl text-[#c88a8a] mb-4"
          style={{ fontFamily: "'Great Vibes', cursive" }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {step < 3 ? "Make a Wish, Nandini!" : "A Special Bouquet for You"}
        </motion.h1>
        
        {step < 3 && (
          <p className="text-[#8a866a] text-lg font-medium italic" style={{ fontFamily: "'Playfair Display', serif" }}>
            {step === 1 ? "Blow on the candles to start the celebration" : "One left! Blow harder! ✨"}
          </p>
        )}
      </div>

      <div className="relative flex flex-col items-center">
        {/* Cake and Bouquet SVG */}
        <div className="relative cursor-pointer" onClick={skipMicrophone}>
          <svg width="280" height="350" viewBox="0 0 200 250" className="drop-shadow-xl overflow-visible">
             <defs>
              <linearGradient id="stemGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8a9a5b" />
                <stop offset="100%" stopColor="#4a5a2b" />
              </linearGradient>
            </defs>

            {/* Cake Base */}
            <rect x="20" y="180" width="160" height="40" rx="10" fill="#E1ADAD" />
            <rect x="35" y="140" width="130" height="40" rx="8" fill="#f0cece" />
            <rect x="50" y="105" width="100" height="35" rx="6" fill="#FDF6E3" stroke="#E1ADAD" strokeWidth="1" />
            
            <AnimatePresence mode="wait">
              {step < 3 ? (
                <motion.g 
                  key="candles"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <g key={i} transform={`translate(${55 + i * 22}, 75)`}>
                      <rect x="0" y="0" width="6" height="30" rx="2" fill={i % 2 === 0 ? "#B2AC88" : "#E1ADAD"} />
                      {!candlesOut[i] && (
                        <motion.path
                          animate={{ scale: [1, 1.2, 1], y: [0, -2, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          d="M3 -15 C6 -10 6 -5 3 0 C0 -5 0 -10 3 -15"
                          fill="#FF8C00"
                        />
                      )}
                      {candlesOut[i] && (
                        <motion.path
                          animate={{ opacity: [0, 0.5, 0], y: -30 }}
                          transition={{ duration: 2 }}
                          d="M3 0 Q5 -10 3 -20" stroke="#cccccc" strokeWidth="2" fill="none"
                        />
                      )}
                    </g>
                  ))}
                </motion.g>
              ) : (
                <motion.g
                  key="merged-bouquet"
                  initial={{ opacity: 0, scale: 0, y: 50 }}
                  animate={{ opacity: 1, scale: 0.8, y: -40 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                >
                   {/* Stems */}
                  <g stroke="url(#stemGradient)" strokeWidth="3" fill="none" strokeLinecap="round">
                    <path d="M100 220 Q95 180 90 140" />
                    <path d="M100 220 Q105 190 115 150" />
                    <path d="M100 220 Q100 200 100 145" />
                    <path d="M100 220 Q90 185 70 135" />
                    <path d="M100 220 Q110 175 130 125" />
                  </g>
                  {/* Leaves */}
                  <g fill="#8a9a5b" opacity="0.9">
                    <ellipse cx="75" cy="170" rx="15" ry="8" transform="rotate(-30 75 170)" />
                    <ellipse cx="125" cy="165" rx="15" ry="8" transform="rotate(30 125 165)" />
                  </g>
                  {/* Flowers */}
                  <Flower cx={100} cy={110} r={30} colors={["#E1ADAD", "#d19a9a", "#c88a8a", "#b57a7a"]} delay={0.2} />
                  <Flower cx={65} cy={100} r={24} colors={["#f0cece", "#E1ADAD", "#d19a9a"]} delay={0.3} />
                  <Flower cx={135} cy={95} r={26} colors={["#E1ADAD", "#d19a9a", "#c88a8a"]} delay={0.4} />
                  <Flower cx={50} cy={120} r={18} colors={["#f0cece", "#E1ADAD"]} delay={0.5} />
                  <Flower cx={150} cy={115} r={20} colors={["#d19a9a", "#c88a8a"]} delay={0.6} />
                </motion.g>
              )}
            </AnimatePresence>
          </svg>

          {step < 3 && (
            <motion.div 
              className="absolute -top-12 left-1/2 -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Wind className="w-8 h-8 text-[#E1ADAD] opacity-40" />
            </motion.div>
          )}
        </div>

        {/* Message Container */}
        <AnimatePresence>
          {step === 3 && (
            <motion.div
              className="glass-card mt-4 p-8 max-w-xl relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#E1ADAD]/30 m-2" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#E1ADAD]/30 m-2" />
              
              <p
                className="text-[#5a5a4a] text-lg md:text-xl leading-relaxed whitespace-pre-line text-center italic"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                "{displayedText}"
                <motion.span
                  className="inline-block w-0.5 h-5 bg-[#E1ADAD] ml-1 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {(permissionDenied || step < 3) && (
        <motion.button
          onClick={skipMicrophone}
          className={`mt-12 px-8 py-3 bg-[#E1ADAD] text-white rounded-full font-medium shadow-lg transition-all ${step === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {permissionDenied ? "Click to Blow Out Candles" : "Skip Microphone"}
        </motion.button>
      )}
    </motion.div>
  );
}

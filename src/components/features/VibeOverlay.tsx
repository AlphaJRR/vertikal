import { motion } from 'framer-motion';

export const VibeOverlay = () => {
  return (
    <>
      {/* Top-right corner badge */}
      <div className="absolute top-4 right-4 z-50 pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 px-4 py-2 rounded-full border-2 border-yellow-300 shadow-2xl shadow-yellow-500/70"
        >
          <span className="text-black font-black text-sm tracking-wider">VIBE™</span>
        </motion.div>
      </div>

      {/* Center overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.9, 1, 0.9], 
            scale: [1, 1.08, 1],
            y: [0, -8, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="bg-gradient-to-r from-yellow-500/95 via-yellow-400/95 to-yellow-500/95 backdrop-blur-lg px-10 py-5 rounded-full border-3 border-yellow-300/70 shadow-2xl shadow-yellow-500/60"
          style={{ borderWidth: '3px' }}
        >
          <motion.span
            animate={{ 
              opacity: [0.95, 1, 0.95],
              scale: [1, 1.08, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-black font-black text-2xl tracking-widest drop-shadow-2xl"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          >
            VIBE™ LIVE
          </motion.span>
        </motion.div>
      </div>
    </>
  );
};


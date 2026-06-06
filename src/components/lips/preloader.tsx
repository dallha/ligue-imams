'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/lips/i18n/language-context';

function PreloaderText() {
  const { t, isRTL } = useLanguage();
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="mt-4 text-white/50 text-sm tracking-wider uppercase"
    >
      {t.common.loading}
    </motion.p>
  );
}

export default function Preloader() {
  const { t, isRTL } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-lips-green-dark flex flex-col items-center justify-center"
        >
          {/* Islamic pattern background */}
          <div className="absolute inset-0 islamic-pattern opacity-10" />

          {/* Logo container with pulse */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative"
          >
            {/* Outer glow ring */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 -m-4 rounded-full bg-lips-gold/20"
            />

            {/* Logo image */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 backdrop-blur-sm border-2 border-lips-gold/40 overflow-hidden p-3">
              <img
                src="/logo.png"
                alt={t.preloader.logoAlt}
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Spinning ornament */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="mt-8 w-10 h-10 border-2 border-lips-gold/30 border-t-lips-gold rounded-full"
          />

          {/* Text */}
          <PreloaderText />

          {/* Arabic text — only show when not in Arabic mode */}
          {!isRTL && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-1 font-arabic text-lips-gold/50 text-xs"
            >
              {t.preloader.bismillah}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

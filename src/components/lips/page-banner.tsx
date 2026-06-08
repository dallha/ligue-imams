'use client';

import { motion } from 'framer-motion';

interface PageBannerProps {
  label: string;
  title: string;
  description?: string;
  gradient?: string;
}

export default function PageBanner({
  label,
  title,
  description = '',
  gradient,
}: PageBannerProps) {
  return (
    <section className={`relative py-16 sm:py-24 lg:py-32 text-white overflow-hidden ${gradient ? `bg-gradient-to-br ${gradient}` : 'bg-[#0A2E17]'}`}>
      {/* Immersive Background */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 islamic-pattern opacity-[0.03] pointer-events-none" />
      
      {/* Golden & Green Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lips-gold/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lips-emerald/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/4" />

      {/* Decorative borders */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lips-gold/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lips-gold/20 to-transparent" />

      {/* Floating abstract elements */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="hidden sm:block absolute top-20 left-20 w-32 h-32 border border-lips-gold/10 rounded-lg" 
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="hidden sm:block absolute bottom-16 right-24 w-24 h-24 border border-white/5 rounded-full" 
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lips-gold/10 border border-lips-gold/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-lips-gold animate-pulse" />
            <span className="text-xs font-bold text-lips-gold tracking-widest uppercase">
              {label}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-xl">
            {title}
          </h1>
          
          {description && (
            <p className="text-white/70 text-lg sm:text-xl leading-relaxed max-w-3xl font-medium">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

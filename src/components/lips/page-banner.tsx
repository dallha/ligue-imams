'use client';

import { motion } from 'framer-motion';

interface PageBannerProps {
  label: string;
  title: string;
  titleAr?: string;
  description: string;
  gradient?: string;
}

export default function PageBanner({
  label,
  title,
  titleAr,
  description,
  gradient = 'from-lips-green-dark via-lips-green to-lips-green-dark',
}: PageBannerProps) {
  return (
    <section className={`relative py-10 sm:py-16 lg:py-24 bg-gradient-to-r ${gradient} text-white overflow-hidden`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 islamic-pattern opacity-10" />
      <div className="hidden sm:block absolute top-10 left-10 w-24 h-24 border border-white/10 rotate-45 rounded-sm" />
      <div className="hidden sm:block absolute bottom-8 right-16 w-16 h-16 border border-lips-gold/20 rotate-12 rounded-sm" />
      <div className="hidden sm:block absolute top-1/3 right-10 w-12 h-12 border border-white/5 rotate-45 rounded-full" />

      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-lips-gold/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
            {label}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mt-3 mb-3">
            {title}
          </h1>
          {titleAr && (
            <p className="font-arabic text-lg sm:text-xl md:text-2xl text-lips-gold mb-4">
              {titleAr}
            </p>
          )}
          <div className="separator-islamic text-lips-gold text-2xl my-4">
            &#10022;
          </div>
          <p className="text-white/70 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {description}
          </p>
        </motion.div>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-lips-gold/40 to-transparent" />
    </section>
  );
}

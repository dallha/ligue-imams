'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  {
    label: 'Accueil',
    href: '#accueil',
  },
  {
    label: 'À Propos',
    href: '#apropos',
    children: [
      { label: 'Notre Mission', href: '#apropos' },
      { label: 'Gouvernance', href: '#gouvernance' },
      { label: 'Carte Membre', href: '#carte-membre' },
    ],
  },
  {
    label: 'Actualités',
    href: '#actualites',
    children: [
      { label: 'Communiqués & Fatwas', href: '#actualites' },
      { label: 'Événements', href: '#evenements' },
      { label: 'Galerie Photos', href: '#galerie' },
    ],
  },
  {
    label: 'Régions',
    href: '#regions',
  },
  {
    label: 'Adhérer',
    href: '#devenir-membre',
  },
  {
    label: 'Vérifier une Carte',
    href: '#verification',
  },
  {
    label: 'Faire un Don',
    href: '#dons',
  },
];

export default function LipsHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top bar - institutional info */}
      <div className="bg-lips-green-dark text-white/80 text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3 w-3" /> +221 33 800 00 00
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="h-3 w-3" /> contact@lips.sn
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" /> Grande Mosquée AN-NOUR, Liberté II,
            Dakar
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-lips-gold/20'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="#accueil" className="flex items-center gap-3 group">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-lips flex items-center justify-center shadow-lg group-hover:shadow-lips-green/30 transition-shadow">
                <span className="text-white font-bold text-sm lg:text-base">
                  LIPS
                </span>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-lips-green-dark text-sm lg:text-base leading-tight">
                  Ligue des Imams
                </div>
                <div className="text-[10px] lg:text-xs text-muted-foreground leading-tight">
                  & Prédicateurs du Sénégal
                </div>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() =>
                    item.children && setActiveDropdown(item.label)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a
                    href={item.href}
                    className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-lips-green transition-colors rounded-md hover:bg-lips-green/5 flex items-center gap-1"
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                    )}
                  </a>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.children && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-border/50 py-1 z-50"
                      >
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-foreground/70 hover:text-lips-green hover:bg-lips-green/5 transition-colors"
                          >
                            {child.label}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Button
                asChild
                className="hidden sm:inline-flex bg-lips-green hover:bg-lips-green-dark text-white shadow-md"
              >
                <a href="#verification">Espace Membre</a>
              </Button>
              <button
                className="lg:hidden p-2 rounded-md hover:bg-lips-green/5 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-border/50 bg-white"
            >
              <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <div key={item.label}>
                    <a
                      href={item.href}
                      className="block px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-lips-green hover:bg-lips-green/5 rounded-md transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </a>
                    {item.children && (
                      <div className="ml-4 space-y-0.5">
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.href}
                            className="block px-3 py-2 text-xs text-muted-foreground hover:text-lips-green hover:bg-lips-green/5 rounded-md transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-2 border-t border-border/50">
                  <Button
                    asChild
                    className="w-full bg-lips-green hover:bg-lips-green-dark text-white"
                  >
                    <a href="#verification" onClick={() => setMobileOpen(false)}>
                      Espace Membre
                    </a>
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

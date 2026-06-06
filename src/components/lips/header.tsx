'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
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
    href: '/',
  },
  {
    label: 'À Propos',
    href: '/a-propos',
    children: [
      { label: 'Notre Mission', href: '/a-propos' },
      { label: 'Gouvernance', href: '/a-propos#gouvernance' },
      { label: 'Carte Membre', href: '/a-propos#carte-membre' },
      { label: 'FAQ', href: '/a-propos#faq' },
    ],
  },
  {
    label: 'Actualités',
    href: '/actualites',
    children: [
      { label: 'Communiqués & Fatwas', href: '/actualites#actualites' },
      { label: 'Événements', href: '/actualites#evenements' },
      { label: 'Galerie Photos', href: '/actualites#galerie' },
      { label: 'Agenda & Calendrier', href: '/agenda' },
    ],
  },
  {
    label: 'Agenda',
    href: '/agenda',
  },
  {
    label: 'Régions',
    href: '/regions',
  },
  {
    label: 'Coran',
    href: '/coran',
  },
  {
    label: 'Adhérer',
    href: '/adherer',
  },
  {
    label: 'Vérifier une Carte',
    href: '/verifier-carte',
  },
  {
    label: 'Faire un Don',
    href: '/faire-un-don',
  },
];

export default function LipsHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('#')[0]);
  };

  return (
    <>
      {/* Top bar - institutional info */}
      <div className="bg-lips-green-dark text-white/80 text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3 w-3" /> <span>+221 33 800 00 00</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="h-3 w-3" /> <span>contact@lips.sn</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" /> <span>Grande Mosquée AN-NOUR, Liberté II, Dakar</span>
          </div>
        </div>
      </div>

      {/* Mobile contact bar - visible on small screens */}
      <div className="bg-lips-green-dark text-white/80 text-[10px] md:hidden">
        <div className="px-4 py-1 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Phone className="h-2.5 w-2.5" /> <span>+221 33 800 00 00</span>
          </span>
          <span className="flex items-center gap-1">
            <Mail className="h-2.5 w-2.5" /> <span>contact@lips.sn</span>
          </span>
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
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Logo LIPS"
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-contain shadow-lg group-hover:shadow-lips-green/30 transition-shadow"
              />
              <div className="hidden sm:block">
                <div className="font-bold text-lips-green-dark text-sm lg:text-base leading-tight">
                  Ligue des Imams
                </div>
                <div className="text-[10px] lg:text-xs text-muted-foreground leading-tight">
                  & Prédicateurs du Sénégal
                </div>
              </div>
            </Link>

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
                  <Link
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors rounded-md flex items-center gap-1 ${
                      isActive(item.href)
                        ? 'text-lips-green bg-lips-green/5'
                        : 'text-foreground/80 hover:text-lips-green hover:bg-lips-green/5'
                    }`}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                    )}
                  </Link>

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
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-foreground/70 hover:text-lips-green hover:bg-lips-green/5 transition-colors"
                          >
                            {child.label}
                          </Link>
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
                <Link href="/espace-membre">Espace Membre</Link>
              </Button>
              <button
                className="lg:hidden p-2.5 rounded-md hover:bg-lips-green/5 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
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
                    <Link
                      href={item.href}
                      className={`block px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                        isActive(item.href)
                          ? 'text-lips-green bg-lips-green/5'
                          : 'text-foreground/80 hover:text-lips-green hover:bg-lips-green/5'
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <div className="ml-4 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-3 py-2.5 text-xs text-muted-foreground hover:text-lips-green hover:bg-lips-green/5 rounded-md transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.label}
                          </Link>
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
                    <Link href="/espace-membre" onClick={() => setMobileOpen(false)}>
                      Espace Membre
                    </Link>
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

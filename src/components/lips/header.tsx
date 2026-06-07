'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/lips/i18n/language-context';
import LanguageSwitcher from '@/components/lips/language-switcher';
import PrayerTimesWidget from '@/components/lips/prayer-times';
import { cn } from '@/lib/utils';

export default function LipsHeader() {
  const { t } = useLanguage();

  const NAV_ITEMS = [
    { label: t.nav.home, href: '/' },
    {
      label: t.nav.about,
      href: '/a-propos',
      children: [
        { label: t.nav.ourMission, href: '/a-propos' },
        { label: t.nav.governance, href: '/a-propos#gouvernance' },
        { label: t.nav.memberCard, href: '/a-propos#carte-membre' },
        { label: t.nav.faq, href: '/a-propos#faq' },
      ],
    },
    {
      label: t.nav.news,
      href: '/actualites',
      children: [
        { label: t.nav.communiquesFatwas, href: '/actualites#actualites' },
        { label: t.nav.events, href: '/actualites#evenements' },
        { label: t.nav.photoGallery, href: '/actualites#galerie' },
        { label: t.nav.agendaCalendar, href: '/agenda' },
      ],
    },
    { label: t.nav.regions, href: '/regions' },
    { label: t.nav.coran, href: '/coran' },
    { label: t.nav.donate, href: '/faire-un-don' },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setExpandedMobile(null);
    setActiveDropdown(null);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('#')[0]);
  };

  const toggleMobileSubmenu = useCallback((label: string) => {
    setExpandedMobile((prev) => (prev === label ? null : label));
  }, []);

  return (
    <>
      {/* Widget placed in normal flow, NOT sticky so it can scroll away */}
      <PrayerTimesWidget />

      {/* Main navigation - Sticky to top */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300 ease-in-out border-b",
          isScrolled
            ? "bg-lips-cream/95 backdrop-blur-xl shadow-lg border-lips-green/10"
            : "bg-lips-cream border-border"
        )}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 xl:h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <img
                src="/logo.png"
                alt={t.preloader.logoAlt}
                className="w-auto h-10 xl:h-12 object-contain relative z-10"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <div 
                  key={item.label}
                  className="relative group px-1"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.children ? (
                    <button className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-colors uppercase tracking-wider",
                      isActive(item.href) || activeDropdown === item.label
                        ? "text-lips-green bg-lips-green/5 dark:text-lips-gold dark:bg-lips-gold/10"
                        : "text-foreground/80 hover:text-lips-green hover:bg-muted dark:hover:text-lips-gold"
                    )}>
                      {item.label}
                      <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", activeDropdown === item.label ? "rotate-180" : "")} />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-sm font-bold transition-colors uppercase tracking-wider",
                        isActive(item.href)
                          ? "text-lips-green bg-lips-green/5 dark:text-lips-gold dark:bg-lips-gold/10"
                          : "text-foreground/80 hover:text-lips-green hover:bg-muted dark:hover:text-lips-gold"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {item.children && (
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-card border border-border shadow-xl rounded-xl overflow-hidden py-2"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className={cn(
                                "block px-4 py-2.5 text-sm font-semibold transition-colors",
                                isActive(child.href)
                                  ? "text-lips-green bg-lips-green/5 dark:text-lips-gold dark:bg-lips-gold/10"
                                  : "text-muted-foreground hover:text-lips-green hover:bg-muted dark:hover:text-lips-gold"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA + Controls + Hamburger Toggle */}
            <div className="flex items-center gap-2 xl:gap-4 shrink-0">
              <Button
                asChild
                className="hidden lg:inline-flex bg-gradient-to-r from-lips-green to-lips-emerald dark:from-lips-gold dark:to-[#C9962A] hover:from-lips-emerald hover:to-lips-green dark:hover:from-[#C9962A] dark:hover:to-[#B08020] text-white dark:text-[#0A2E17] font-bold rounded-full shadow-lg text-xs h-10 px-6 transition-all hover:scale-105 duration-300"
              >
                <Link href="/espace-membre">{t.nav.memberArea}</Link>
              </Button>
              
              <div className="flex items-center bg-muted/50 rounded-full p-1 border border-border">
                <LanguageSwitcher />
              </div>

              <button
                className="xl:hidden p-2.5 rounded-full transition-colors text-foreground hover:bg-muted border border-border min-w-[40px] min-h-[40px] flex items-center justify-center"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? t.common.close || 'Fermer' : t.common.menu}
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
      </header>

      {/* Mobile / Tablet Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] xl:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[90%] max-w-sm bg-lips-cream border-l border-border/50 z-[70] xl:hidden flex flex-col shadow-2xl"
            >
              {/* Panel header */}
              <div className="bg-card/50 backdrop-blur-md border-b border-border px-5 py-4 flex items-center justify-between shrink-0">
                <Link
                  href="/"
                  className="flex items-center gap-3"
                  onClick={() => setMobileOpen(false)}
                >
                  <img
                    src="/logo.png"
                    alt={t.preloader.logoAlt}
                    className="w-auto h-10 object-contain"
                  />
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-accent transition-colors flex items-center justify-center"
                  aria-label={t.common.close || 'Fermer'}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation items */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {NAV_ITEMS.map((item) => (
                  <div key={item.label} className="border-b border-border/50 pb-2 mb-2 last:border-0">
                    {item.children ? (
                      <>
                        <button
                          onClick={() => toggleMobileSubmenu(item.label)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3 text-base font-bold rounded-xl transition-colors uppercase tracking-wider",
                            isActive(item.href)
                              ? "text-lips-green bg-lips-green/5 dark:text-lips-gold dark:bg-lips-gold/10"
                              : "text-foreground/80 hover:text-lips-green hover:bg-muted dark:hover:text-lips-gold"
                          )}
                        >
                          <span>{item.label}</span>
                          <ChevronRight
                            className={cn(
                              "h-5 w-5 transition-transform duration-300",
                              expandedMobile === item.label ? "rotate-90 text-lips-green dark:text-lips-gold" : "text-muted-foreground"
                            )}
                          />
                        </button>
                        <AnimatePresence>
                          {expandedMobile === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="mx-4 mt-2 mb-4 p-4 rounded-2xl bg-muted/50 border border-border space-y-3">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.label}
                                    href={child.href}
                                    className="flex items-center gap-3 text-sm font-semibold text-muted-foreground hover:text-lips-green dark:hover:text-lips-gold transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-lips-gold/50" />
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "block px-4 py-3 text-base font-bold rounded-xl transition-colors uppercase tracking-wider",
                          isActive(item.href)
                            ? "text-lips-green bg-lips-green/5 dark:text-lips-gold dark:bg-lips-gold/10"
                            : "text-foreground/80 hover:text-lips-green hover:bg-muted dark:hover:text-lips-gold"
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Bottom section */}
              <div className="bg-card/50 backdrop-blur-md border-t border-border p-5 space-y-4 shrink-0">
                <Button
                  asChild
                  className="w-full bg-lips-gold hover:bg-[#C9962A] text-[#0A2E17] font-bold rounded-full h-12 shadow-lg shadow-lips-gold/20"
                >
                  <Link href="/espace-membre" onClick={() => setMobileOpen(false)}>
                    {t.nav.memberArea}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

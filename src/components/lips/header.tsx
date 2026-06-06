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
import ThemeToggle from '@/components/lips/theme-toggle';

export default function LipsHeader() {
  const { t } = useLanguage();

  const NAV_ITEMS = [
    {
      label: t.nav.home,
      href: '/',
    },
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
    {
      label: t.nav.agenda,
      href: '/agenda',
    },
    {
      label: t.nav.regions,
      href: '/regions',
    },
    {
      label: t.nav.coran,
      href: '/coran',
    },
    {
      label: t.nav.join,
      href: '/adherer',
    },
    {
      label: t.nav.verifyCard,
      href: '/verifier-carte',
    },
    {
      label: t.nav.donate,
      href: '/faire-un-don',
    },
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setExpandedMobile(null);
  }, [pathname]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMobileOpen(false);
        setExpandedMobile(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      {/* Main navigation */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-lips-gold/20'
            : 'bg-background/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 xl:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <img
                src="/logo.png"
                alt={t.preloader.logoAlt}
                className="w-9 h-9 xl:w-12 xl:h-12 rounded-full object-contain shadow-lg group-hover:shadow-lips-green/30 transition-shadow"
              />
              <div className="hidden sm:block">
                <div className="font-bold text-lips-green-dark text-sm xl:text-base leading-tight">
                  {t.footer.orgLine1}
                </div>
                <div className="text-[10px] xl:text-xs text-muted-foreground leading-tight">
                  {t.footer.orgLine2}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation — xl breakpoint (1280px+) */}
            <nav className="hidden xl:flex items-center gap-0.5">
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
                    className={`px-2.5 py-2 text-[13px] font-medium transition-colors rounded-md flex items-center gap-1 whitespace-nowrap ${
                      isActive(item.href)
                        ? 'text-lips-green bg-lips-green/5'
                        : 'text-foreground/80 hover:text-lips-green hover:bg-lips-green/5'
                    }`}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown className="h-3 w-3 opacity-50" />
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
                        className="absolute top-full left-0 mt-1 w-52 bg-popover rounded-lg shadow-xl border border-border/50 py-1 z-50"
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

            {/* CTA + Controls + Mobile Toggle */}
            <div className="flex items-center gap-2 xl:gap-3 shrink-0">
              <Button
                asChild
                className="hidden sm:inline-flex bg-lips-green hover:bg-lips-green-dark text-white shadow-md text-xs sm:text-sm h-9 px-3 sm:px-4"
              >
                <Link href="/espace-membre">{t.nav.memberArea}</Link>
              </Button>
              <ThemeToggle />
              <LanguageSwitcher />
              <button
                className="xl:hidden p-2.5 rounded-md hover:bg-lips-green/5 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? t.common.close || 'Fermer' : t.common.menu}
                aria-expanded={mobileOpen}
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

      {/* Mobile / Tablet Navigation — Full overlay below xl (1280px) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 xl:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-background border-s border-border/50 z-50 xl:hidden overflow-y-auto shadow-2xl"
            >
              {/* Panel header */}
              <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center justify-between">
                <Link
                  href="/"
                  className="flex items-center gap-2.5"
                  onClick={() => setMobileOpen(false)}
                >
                  <img
                    src="/logo.png"
                    alt={t.preloader.logoAlt}
                    className="w-8 h-8 rounded-full object-contain"
                  />
                  <span className="font-bold text-lips-green-dark text-sm">
                    {t.footer.orgLine1}
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-md hover:bg-lips-green/5 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                  aria-label={t.common.close || 'Fermer'}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation items */}
              <nav className="px-3 py-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <div key={item.label}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() => toggleMobileSubmenu(item.label)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                            isActive(item.href)
                              ? 'text-lips-green bg-lips-green/5'
                              : 'text-foreground/80 hover:text-lips-green hover:bg-lips-green/5'
                          }`}
                        >
                          <span>{item.label}</span>
                          <ChevronRight
                            className={`h-4 w-4 opacity-50 transition-transform duration-200 ${
                              expandedMobile === item.label ? 'rotate-90' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {expandedMobile === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="ms-4 space-y-0.5 py-1">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.label}
                                    href={child.href}
                                    className="block px-3 py-2 text-sm text-muted-foreground hover:text-lips-green hover:bg-lips-green/5 rounded-md transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                  >
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
                        className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                          isActive(item.href)
                            ? 'text-lips-green bg-lips-green/5'
                            : 'text-foreground/80 hover:text-lips-green hover:bg-lips-green/5'
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Bottom section */}
              <div className="sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-border/50 px-4 py-4 space-y-3">
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
                <Button
                  asChild
                  className="w-full bg-lips-green hover:bg-lips-green-dark text-white h-11"
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

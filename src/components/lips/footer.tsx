'use client';

import { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Facebook,
  Twitter,
  Youtube,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/lips/i18n/language-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function LipsFooter() {
  const { t, isRTL } = useLanguage();
  const [currentYear] = useState(() => new Date().getFullYear());

  const QUICK_LINKS = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.about, href: '/a-propos' },
    { label: t.nav.regions, href: '/regions' },
    { label: t.nav.memberArea, href: '/espace-membre' },
    { label: t.nav.verifyCard, href: '/verifier-carte' },
  ];

  const RESOURCE_LINKS = [
    { label: t.actualites.communiques, href: '/actualites' },
    { label: t.actualites.fatwas, href: '/actualites' },
    { label: t.nav.coran, href: '/coran' },
    { label: t.actualites.events, href: '/actualites' },
    { label: t.nav.join, href: '/adherer' },
    { label: t.nav.donate, href: '/faire-un-don' },
  ];

  const addressLines = t.footer.address.split('\n');

  return (
    <footer id="contact" className="bg-lips-cream dark:bg-[#05180C] text-lips-green-dark/80 dark:text-white/80 relative overflow-hidden transition-colors duration-500">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 islamic-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute -top-60 -right-60 w-96 h-96 bg-lips-gold/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-60 -left-60 w-96 h-96 bg-lips-green/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Top golden glowing border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lips-green dark:via-lips-gold to-transparent opacity-30 dark:opacity-60" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-lips-green dark:bg-lips-gold shadow-[0_0_20px_2px_rgba(27,107,58,0.3)] dark:shadow-[0_0_20px_2px_rgba(201,150,42,0.6)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand column (takes 4 columns on large screens) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-4 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-lips-gold/20 rounded-full blur-md group-hover:bg-lips-gold/40 transition-colors" />
                <img
                  src="/logo.png"
                  alt={t.preloader.logoAlt}
                  className="w-16 h-16 rounded-full object-contain relative z-10 border-2 border-white/10"
                />
              </div>
              <div>
                <div className="font-bold text-lips-green-dark dark:text-white text-lg leading-tight tracking-wide transition-colors">
                  {t.footer.orgLine1}
                </div>
                <div className="text-xs text-lips-green dark:text-lips-gold uppercase font-bold tracking-widest mt-1 transition-colors">
                  {t.footer.orgLine2}
                </div>
              </div>
            </Link>
            
            <p className="text-sm text-lips-green-dark/70 dark:text-white/60 leading-relaxed mb-6 max-w-sm transition-colors">
              {t.footer.description}
            </p>
            
            {!isRTL && (
              <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-lips-green/10 dark:border-white/10 backdrop-blur-sm mb-8 inline-block transition-colors">
                <p className="font-arabic text-lips-green dark:text-lips-gold text-lg drop-shadow-sm transition-colors">
                  {t.hero.arabicMotto}
                </p>
              </div>
            )}

            {/* Social links */}
            <div className="flex items-center gap-3 mt-auto">
              {[
                { icon: Facebook, href: '#', label: 'Facebook', hover: 'hover:bg-blue-600 hover:border-blue-500' },
                { icon: Twitter, href: '#', label: 'Twitter', hover: 'hover:bg-sky-500 hover:border-sky-400' },
                { icon: Youtube, href: '#', label: 'Youtube', hover: 'hover:bg-red-600 hover:border-red-500' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={cn(
                    "w-12 h-12 rounded-full bg-white/50 dark:bg-white/5 border border-lips-green/10 dark:border-white/10 text-lips-green-dark/70 dark:text-white/70 flex items-center justify-center transition-all duration-300",
                    social.hover,
                    "hover:text-white dark:hover:text-white hover:-translate-y-1 hover:shadow-lg"
                  )}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links (takes 2 columns) */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="font-bold text-lips-green-dark dark:text-white text-sm mb-6 uppercase tracking-widest flex items-center gap-2 transition-colors">
              <span className="w-2 h-2 rounded-full bg-lips-green dark:bg-lips-gold" />
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-lips-green-dark/70 dark:text-white/60 hover:text-lips-green dark:hover:text-lips-gold transition-colors flex items-center gap-2 group py-1 font-medium"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-lips-green dark:text-lips-gold" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources (takes 2 columns) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-lips-green-dark dark:text-white text-sm mb-6 uppercase tracking-widest flex items-center gap-2 transition-colors">
              <span className="w-2 h-2 rounded-full bg-lips-emerald" />
              {t.footer.resources}
            </h4>
            <ul className="space-y-3">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-lips-green-dark/70 dark:text-white/60 hover:text-lips-emerald transition-colors flex items-center gap-2 group py-1 font-medium"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-lips-emerald" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact (takes 3 columns) */}
          <div className="lg:col-span-3 lg:col-start-10">
            <h4 className="font-bold text-lips-green-dark dark:text-white text-sm mb-6 uppercase tracking-widest flex items-center gap-2 transition-colors">
              <span className="w-2 h-2 rounded-full bg-lips-green-light" />
              {t.footer.contact}
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/50 dark:bg-white/5 border border-lips-green/10 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:bg-lips-green/10 dark:group-hover:bg-lips-gold/20 dark:group-hover:border-lips-gold/30 transition-colors">
                  <MapPin className="h-4 w-4 text-lips-green dark:text-lips-gold" />
                </div>
                <span className="text-sm text-lips-green-dark/70 dark:text-white/70 leading-relaxed pt-1">
                  {addressLines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < addressLines.length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/50 dark:bg-white/5 border border-lips-green/10 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:bg-lips-green/10 dark:group-hover:bg-lips-gold/20 dark:group-hover:border-lips-gold/30 transition-colors">
                  <Phone className="h-4 w-4 text-lips-green dark:text-lips-gold" />
                </div>
                <span className="text-sm text-lips-green-dark/70 dark:text-white/70 font-mono tracking-wide">+221 33 800 00 00</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/50 dark:bg-white/5 border border-lips-green/10 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:bg-lips-green/10 dark:group-hover:bg-lips-gold/20 dark:group-hover:border-lips-gold/30 transition-colors">
                  <Mail className="h-4 w-4 text-lips-green dark:text-lips-gold" />
                </div>
                <span className="text-sm text-lips-green-dark/70 dark:text-white/70">contact@lips.sn</span>
              </li>
            </ul>

            <div className="mt-8">
              <Button asChild className="w-full bg-lips-green dark:bg-white/10 hover:bg-lips-green-light dark:hover:bg-white/20 text-white border border-transparent dark:border-white/20 rounded-full font-bold transition-all shadow-md">
                <Link href="/adherer">{t.nav.join}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-lips-green/10 dark:border-white/10 bg-white/40 dark:bg-black/20 relative z-10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-lips-green-dark/50 dark:text-white/40 font-bold dark:font-medium">
          <p>
            &copy; {currentYear} {t.footer.copyright}
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-lips-green dark:hover:text-white transition-colors">
              {t.footer.legalNotice}
            </Link>
            <div className="w-1 h-1 rounded-full bg-lips-green/30 dark:bg-white/20" />
            <Link href="#" className="hover:text-lips-green dark:hover:text-white transition-colors">
              {t.footer.privacyPolicy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

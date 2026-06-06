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
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/lips/i18n/language-context';

export default function LipsFooter() {
  const { t } = useLanguage();
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
    <footer id="contact" className="bg-lips-green-dark text-white/80 relative">
      {/* Top border */}
      <div className="h-1 bg-gradient-to-r from-lips-gold via-lips-green to-lips-gold" />

      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="Logo LIPS"
                className="w-10 h-10 rounded-full object-contain"
              />
              <div>
                <div className="font-semibold text-white text-sm">
                  {t.footer.orgLine1}
                </div>
                <div className="text-xs text-white/50">
                  {t.footer.orgLine2}
                </div>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              {t.footer.description}
            </p>
            <p className="font-arabic text-lips-gold text-sm">
              بِالصَّبْرِ وَالْيَقِينِ تُنَالُ الْإِمَامَةُ فِي الدِّينِ
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Youtube, href: '#', label: 'Youtube' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-lips-gold/20 hover:text-lips-gold flex items-center justify-center transition-colors"
                >
                  <social.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-lips-gold transition-colors flex items-center gap-1.5 py-1"
                  >
                    <ExternalLink className="h-3 w-3 opacity-50" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">
              {t.footer.resources}
            </h4>
            <ul className="space-y-2.5">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-lips-gold transition-colors flex items-center gap-1.5 py-1"
                  >
                    <ExternalLink className="h-3 w-3 opacity-50" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">
              {t.footer.contact}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-lips-gold shrink-0 mt-0.5" />
                <span className="text-sm text-white/60">
                  {addressLines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < addressLines.length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-lips-gold shrink-0" />
                <span className="text-sm text-white/60">+221 33 800 00 00</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-lips-gold shrink-0" />
                <span className="text-sm text-white/60">contact@lips.sn</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>
            &copy; {currentYear} {t.footer.copyright}
          </span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white/60 transition-colors">
              {t.footer.legalNotice}
            </a>
            <a href="#" className="hover:text-white/60 transition-colors">
              {t.footer.privacyPolicy}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

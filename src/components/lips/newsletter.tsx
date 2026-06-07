'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/lips/i18n/language-context';

export default function NewsletterSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section
      ref={sectionRef}
      id="newsletter"
      className="py-16 sm:py-24 bg-lips-cream relative"
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-br from-lips-cream via-background to-muted/30 border border-border/50 rounded-[3rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            
            {/* Background glowing orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-lips-green/10 rounded-full blur-[80px]" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-card shadow-lg border border-border/50 flex items-center justify-center mb-6">
                <Mail className="h-8 w-8 text-lips-green" />
              </div>
              
              <h3 className="text-3xl font-bold text-foreground mb-4">
                {t.newsletter.title}
              </h3>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                {t.newsletter.desc}
              </p>

              {subscribed ? (
                <div className="flex items-center justify-center gap-3 px-6 py-4 bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="h-6 w-6" />
                  <span className="font-bold">{t.newsletter.success}</span>
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}
                  className="w-full max-w-md relative"
                >
                  <div className="relative flex items-center">
                    <Input
                      type="email"
                      placeholder={t.newsletter.placeholder}
                      className="h-14 pl-6 pr-32 rounded-full bg-card border-border shadow-inner focus-visible:ring-lips-green text-base"
                      required
                    />
                    <Button 
                      type="submit" 
                      className="absolute right-1.5 top-1.5 bottom-1.5 rounded-full bg-lips-green hover:bg-lips-green-dark text-white px-6 font-bold shadow-md transition-all hover:scale-105"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {t.newsletter.subscribe}
                    </Button>
                  </div>
                </form>
              )}

              <p className="text-xs text-muted-foreground mt-6 uppercase tracking-wider font-medium">
                {t.newsletter.privacy}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

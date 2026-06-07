'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/lips/i18n/language-context';

interface FAQItem {
  id: number;
  question: string;
  reponse: string;
  ordre: number;
}

export default function FAQSection() {
  const { p } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });
  const [mounted, setMounted] = useState(false);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch('/api/public/faq')
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          setFaqItems(data.data);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const items = faqItems.length > 0
    ? faqItems.map(item => ({ q: item.question, a: item.reponse }))
    : [
        { q: p.faq.items.q1.q, a: p.faq.items.q1.a },
        { q: p.faq.items.q2.q, a: p.faq.items.q2.a },
        { q: p.faq.items.q3.q, a: p.faq.items.q3.a },
        { q: p.faq.items.q4.q, a: p.faq.items.q4.a },
        { q: p.faq.items.q5.q, a: p.faq.items.q5.a },
      ];

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="py-16 sm:py-24 lg:py-32 bg-background relative"
    >
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-lips-emerald/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lips-emerald/10 border border-lips-emerald/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-lips-emerald animate-pulse" />
            <span className="text-xs font-bold text-lips-emerald tracking-widest uppercase">
              {p.faq.sectionTag}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
            {p.faq.sectionTitle}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {p.faq.sectionDesc}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {mounted && (
            <Accordion type="single" collapsible className="space-y-4">
              {items.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl px-6 data-[state=open]:bg-card data-[state=open]:border-lips-emerald/30 data-[state=open]:shadow-xl transition-all duration-300"
                >
                  <AccordionTrigger className="text-base sm:text-lg font-bold text-foreground hover:text-lips-emerald text-left py-6 hover:no-underline [&[data-state=open]>div>svg]:text-lips-emerald">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 group-data-[state=open]:bg-lips-emerald/10 transition-colors">
                        <HelpCircle className="h-5 w-5 text-muted-foreground transition-colors" />
                      </div>
                      {item.q}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground leading-relaxed pb-6 pl-[3.5rem] pr-4">
                    <div className="border-l-2 border-lips-emerald/30 pl-4 py-1">
                      {item.a}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16 p-8 bg-muted/50 rounded-3xl border border-border/50"
        >
          <div className="w-16 h-16 rounded-full bg-card shadow-sm flex items-center justify-center mx-auto mb-4 border border-border">
            <MessageCircle className="h-8 w-8 text-lips-emerald" />
          </div>
          <h4 className="text-xl font-bold text-foreground mb-2">
            {p.faq.notFound}
          </h4>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Notre équipe est disponible pour répondre à toutes vos interrogations supplémentaires.
          </p>
          <Button className="bg-lips-emerald hover:bg-emerald-700 text-white rounded-full font-bold px-8 h-12 shadow-lg shadow-lips-emerald/20">
            {p.faq.contactUs}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

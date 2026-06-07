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
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
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

  // Fallback to i18n if DB is empty
  const items = faqItems.length > 0
    ? faqItems.map(item => ({ q: item.question, a: item.reponse }))
    : [
        { q: p.faq.items.q1.q, a: p.faq.items.q1.a },
        { q: p.faq.items.q2.q, a: p.faq.items.q2.a },
        { q: p.faq.items.q3.q, a: p.faq.items.q3.a },
        { q: p.faq.items.q4.q, a: p.faq.items.q4.a },
        { q: p.faq.items.q5.q, a: p.faq.items.q5.a },
        { q: p.faq.items.q6.q, a: p.faq.items.q6.a },
        { q: p.faq.items.q7.q, a: p.faq.items.q7.a },
        { q: p.faq.items.q8.q, a: p.faq.items.q8.a },
      ];

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="py-12 sm:py-20 lg:py-28 bg-white dark:bg-card relative"
    >
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
            {p.faq.sectionTag}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
            {p.faq.sectionTitle}
          </h2>
          <div className="separator-islamic text-lips-gold text-2xl my-4">&#10022;</div>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            {p.faq.sectionDesc}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {mounted ? (
            <Accordion type="single" collapsible className="space-y-3">
              {items.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white dark:bg-card border border-border/50 rounded-xl px-5 data-[state=open]:border-lips-green/20 data-[state=open]:shadow-md transition-all"
                >
                  <AccordionTrigger className="text-sm font-semibold text-lips-green-dark hover:text-lips-green text-left py-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-4 w-4 text-lips-gold shrink-0" />
                      {item.q}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 pl-7">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="bg-white dark:bg-card border border-border/50 rounded-xl px-5 py-4">
                  <div className="flex items-center gap-3 text-sm font-semibold text-lips-green-dark">
                    <HelpCircle className="h-4 w-4 text-lips-gold shrink-0" />
                    {item.q}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <p className="text-sm text-muted-foreground mb-4">
            {p.faq.notFound}
          </p>
          <Button variant="outline" className="border-lips-green/30 text-lips-green hover:bg-lips-green/5">
            <MessageCircle className="h-4 w-4 mr-2" />
            {p.faq.contactUs}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

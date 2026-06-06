'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NewsletterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section
      ref={sectionRef}
      id="newsletter"
      className="py-10 sm:py-16 bg-lips-cream relative"
    >
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-12 h-12 rounded-full bg-lips-green/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-5 w-5 text-lips-green" />
          </div>
          <h3 className="text-xl font-bold text-lips-green-dark mb-2">
            Restez Informé
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Recevez les communiqués, fatwas et annonces de la LIPS directement dans votre boîte mail.
          </p>

          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-lips-green">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Merci ! Vous êtes maintenant inscrit(e) à la newsletter.</span>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="votre.email@exemple.sn"
                className="h-11 bg-white border-lips-green/20 focus:border-lips-green"
                required
              />
              <Button type="submit" className="bg-lips-green hover:bg-lips-green-dark text-white h-11 px-6 shrink-0">
                <Send className="h-4 w-4 mr-2" />
                S&apos;inscrire
              </Button>
            </form>
          )}

          <p className="text-[10px] text-muted-foreground mt-3">
            Pas de spam. Désinscription possible à tout moment. Vos données restent confidentielles.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  UserPlus,
  Heart,
  Shield,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomeCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 lg:py-24 bg-gradient-to-r from-lips-green-dark via-lips-green to-lips-green-dark text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 islamic-pattern opacity-10" />
      <div className="absolute top-10 right-10 w-32 h-32 border border-white/5 rotate-45 rounded-sm" />
      <div className="absolute bottom-10 left-16 w-20 h-20 border border-lips-gold/10 rotate-12 rounded-sm" />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Adhérer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-6 w-6 text-lips-gold" />
            </div>
            <h3 className="text-xl font-bold mb-2">Rejoignez la LIPS</h3>
            <p className="text-white/60 text-sm mb-5 leading-relaxed">
              Devenir membre de la LIPS, c&apos;est accéder à la carte membre
              nationale, aux formations continues et au réseau institutionnel des
              imams du Sénégal.
            </p>
            <Button asChild className="bg-lips-gold hover:bg-lips-gold-light text-lips-green-dark font-semibold">
              <Link href="/adherer">
                Adhérer maintenant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>

          {/* Vérifier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-lips-gold" />
            </div>
            <h3 className="text-xl font-bold mb-2">Vérifier une Carte</h3>
            <p className="text-white/60 text-sm mb-5 leading-relaxed">
              Saisissez le matricule d&apos;une carte membre pour vérifier
              instantanément sa validité et l&apos;authenticité du porteur via
              notre système sécurisé.
            </p>
            <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
              <Link href="/verifier-carte">
                Vérifier une carte
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>

          {/* Coran */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-6 w-6 text-lips-gold" />
            </div>
            <h3 className="text-xl font-bold mb-2">Le Saint Coran</h3>
            <p className="text-white/60 text-sm mb-5 leading-relaxed">
              Explorez le Livre Saint, écoutez les récitations de nos imams et
              accédez aux ressources coraniques pour approfondir votre foi.
            </p>
            <Button asChild className="bg-lips-gold hover:bg-lips-gold-light text-lips-green-dark font-semibold">
              <Link href="/coran">
                Lire le Coran
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>

          {/* Don */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-lips-gold" />
            </div>
            <h3 className="text-xl font-bold mb-2">Faire un Don</h3>
            <p className="text-white/60 text-sm mb-5 leading-relaxed">
              Soutenez la formation des imams, la solidarité communautaire et
              le maintien de la paix sociale au Sénégal par votre contribution
              généreuse.
            </p>
            <Button asChild className="bg-lips-gold hover:bg-lips-gold-light text-lips-green-dark font-semibold">
              <Link href="/faire-un-don">
                Faire un don
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Quran verse */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="font-arabic text-lips-gold text-xl mb-2">
            مَّن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا
          </p>
          <p className="text-white/40 text-xs italic">
            &laquo; Qui est celui qui ferait un prêt généreux à Allah ? &raquo; — Coran 2:245
          </p>
        </motion.div>
      </div>
    </section>
  );
}

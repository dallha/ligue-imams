'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Camera, Calendar, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/lips/i18n/language-context';

interface GalerieItem {
  id: number;
  titre: string;
  titreAr?: string;
  lieu?: string;
  date?: string;
  count: number;
  gradient: string;
  imageUrl?: string;
}


export default function GalerieSection() {
  const { p, isRTL } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [dbPhotos, setDbPhotos] = useState<GalerieItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/public/galerie?limit=6')
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          setDbPhotos(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const PHOTOS = dbPhotos;


  return (
    <section
      ref={sectionRef}
      id="galerie"
      className="py-12 sm:py-20 lg:py-28 bg-lips-cream relative overflow-hidden"
    >
      <div className="absolute inset-0 islamic-pattern opacity-5" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
            {p.galerie.sectionTag}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
            {p.galerie.sectionTitle}
          </h2>
          <div className="separator-islamic text-lips-gold text-2xl my-4">&#10022;</div>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            {p.galerie.sectionDesc}
          </p>
        </motion.div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PHOTOS.length === 0 && loaded ? (
            <div className="col-span-3 text-center py-16 text-muted-foreground">
              <Camera className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm">La galerie photos sera disponible prochainement.</p>
            </div>
          ) : (
            PHOTOS.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300">
                  {/* Gradient background as placeholder */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${photo.gradient}`} />
                  <div className="absolute inset-0 islamic-pattern opacity-20" />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4">
                    <div className="flex justify-between items-start">
                      <Badge className="bg-white/20 backdrop-blur-sm text-white text-[10px] border-0">
                        <Camera className="h-3 w-3 mr-1" />
                        {photo.count} {p.galerie.photosCount}
                      </Badge>
                    </div>

                    <div className="text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h4 className="font-bold text-sm leading-tight">
                        {isRTL && photo.titreAr ? photo.titreAr : photo.titre}
                      </h4>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-white/70">
                        {photo.lieu && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {photo.lieu}
                          </span>
                        )}
                        {photo.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {photo.date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute top-0 right-0 w-16 h-16">
                    <div className="absolute top-0 right-0 w-24 h-24 -translate-y-12 translate-x-12 rotate-45 bg-white/5" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FAQ_ITEMS = [
  {
    q: 'Quelles sont les conditions pour adhérer à la LIPS ?',
    a: 'Pour adhérer à la LIPS, vous devez être un imam ou prédicateur exerçant au Sénégal, être parrainé par un membre actif ou un responsable régional, et vous acquitter de la cotisation annuelle. La candidature est soumise à la validation du responsable régional de votre zone d\'affectation. Le processus complet prend environ 72 heures ouvrées après soumission du formulaire en ligne.',
  },
  {
    q: 'Comment obtenir la carte membre nationale ?',
    a: 'La carte membre nationale est délivrée après validation de votre candidature et paiement de la cotisation annuelle. Elle porte un matricule unique au format LIPS-ANNÉE-RÉGION-NUMÉRO et intègre un QR code de vérification. La carte est valable du 1er janvier au 31 décembre de chaque année. Le renouvellement se fait par le paiement de la cotisation annuelle.',
  },
  {
    q: 'Quel est le montant de la cotisation annuelle ?',
    a: 'La cotisation annuelle est fixée à 5 000 FCFA pour les imams et prédicateurs, et 10 000 FCFA pour les responsables régionaux et membres du Choura. Ce montant couvre les frais de fonctionnement de la LIPS, l\'émission de la carte membre et l\'accès aux formations continues. Des facilités de paiement sont disponibles via CinetPay, Wave ou en espèces à la délégation régionale.',
  },
  {
    q: 'La LIPS est-elle reconnue par les autorités de l\'État ?',
    a: 'Oui, la LIPS est reconnue comme organisation confessionnelle de référence par les autorités sénégalaises. Elle siège au Haut Conseil Islamique et est consultée par le gouvernement sur les questions religieuses et sociétales. La LIPS bénéficie d\'un agrément officiel et entretient des relations institutionnelles avec les ministères de l\'Intérieur, de l\'Éducation et de la Justice.',
  },
  {
    q: 'Comment vérifier l\'authenticité d\'une carte membre ?',
    a: 'Chaque carte membre intègre un QR code qui, une fois scanné, redirige vers la page de vérification du site lips.sn. Vous pouvez également saisir le matricule directement dans le module "Vérifier une Carte" sur le site. Le système confirmera le statut du membre (actif, expiré ou en attente) ainsi que ses informations d\'identification.',
  },
  {
    q: 'Quels types de formations la LIPS propose-t-elle ?',
    a: 'La LIPS organise des formations continues couvrant plusieurs domaines : sciences islamiques (fiqh, aqida, tafsir), communication et prédication moderne, gestion communautaire et administrative, médiation et résolution de conflits, et accompagnement psycho-social. Ces formations sont dispensées lors de séminaires régionaux et nationaux, avec des formateurs certifiés et des partenariats académiques.',
  },
  {
    q: 'Comment la LIPS intervient-elle en faveur de la paix sociale ?',
    a: 'La LIPS joue un rôle actif dans la prévention des tensions communautaires et la promotion du dialogue interreligieux. Ses interventions incluent la médiation lors de conflits locaux, l\'émission de communiqués de paix, l\'organisation de rencontres interconfessionnelles, et la formation des imams à la prédication modérée et inclusive. La LIPS est membre du Cadre de Concertation des Acteurs Religieux pour la Paix.',
  },
  {
    q: 'Puis-je faire un don à la LIPS ?',
    a: 'Oui, les dons sont essentiels au fonctionnement de la LIPS et à ses actions de solidarité. Vous pouvez contribuer via notre plateforme de paiement sécurisée (CinetPay, Wave) ou en espèces à la délégation régionale. Les dons financent les formations, le fond de solidarité pour les imams en difficulté, et les actions communautaires. Un reçu fiscal est délivré pour chaque don.',
  },
];

export default function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="py-12 sm:py-20 lg:py-28 bg-white relative"
    >
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
            Questions Fréquentes
          </h2>
          <div className="separator-islamic text-lips-gold text-2xl my-4">&#10022;</div>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Retrouvez les réponses aux questions les plus courantes sur la LIPS, l&apos;adhésion, la carte membre et nos missions.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border border-border/50 rounded-xl px-5 data-[state=open]:border-lips-green/20 data-[state=open]:shadow-md transition-all"
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
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Vous n&apos;avez pas trouvé la réponse à votre question ?
          </p>
          <Button variant="outline" className="border-lips-green/30 text-lips-green hover:bg-lips-green/5">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contactez-nous
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

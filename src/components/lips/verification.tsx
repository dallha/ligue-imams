'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  QrCode,
  User,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { validateMatricule, parseMatricule } from '@/lib/lips/matricule';
import { REGIONS_DATA } from '@/lib/lips/types';

interface VerificationResult {
  status: 'valid' | 'expired' | 'pending' | 'not_found';
  data?: {
    nom: string;
    region: string;
    role: string;
    validite: string;
    matricule: string;
  };
}

export default function VerificationSection() {
  const [matricule, setMatricule] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState('');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const handleVerify = async () => {
    setError('');
    setResult(null);

    if (!matricule.trim()) {
      setError('Veuillez saisir un numéro de matricule');
      return;
    }

    if (!validateMatricule(matricule.trim().toUpperCase())) {
      setError(
        'Format invalide. Le matricule doit respecter le format : LIPS-2025-DKR-000124'
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/verifier-carte?matricule=${encodeURIComponent(matricule.trim().toUpperCase())}`
      );
      const data = await response.json();
      setResult(data);
    } catch {
      setError('Erreur de connexion au serveur. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'valid':
        return {
          icon: CheckCircle2,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          label: 'Carte Valide',
          badgeVariant: 'default' as const,
          badgeClass: 'bg-green-600',
        };
      case 'expired':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          label: 'Carte Expirée',
          badgeVariant: 'destructive' as const,
          badgeClass: '',
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          label: 'En Attente',
          badgeVariant: 'secondary' as const,
          badgeClass: '',
        };
      default:
        return {
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          label: 'Non Trouvé',
          badgeVariant: 'destructive' as const,
          badgeClass: '',
        };
    }
  };

  const parsed = matricule.trim()
    ? parseMatricule(matricule.trim().toUpperCase())
    : null;
  const matchedRegion = parsed
    ? REGIONS_DATA.find((r) => r.code === parsed.regionCode)
    : null;

  return (
    <section
      ref={sectionRef}
      id="verification"
      className="py-20 lg:py-28 bg-white relative"
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
            Vérification
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
            Vérifier une Carte Membre
          </h2>
          <div className="separator-islamic text-lips-gold text-2xl my-4">
            &#10022;
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            Saisissez le numéro de matricule figurant sur la carte membre pour
            vérifier instantanément sa validité. Le format est
            LIPS-ANNÉE-RÉGION-NUMÉRO.
          </p>
        </motion.div>

        {/* Verification card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-lips-green/20 shadow-xl shadow-lips-green/5 overflow-hidden">
            {/* Card header with gradient */}
            <div className="bg-gradient-lips p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg">
                    Carte Membre Nationale
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Système de vérification sécurisé LIPS
                  </CardDescription>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              {/* Input area */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={matricule}
                      onChange={(e) => setMatricule(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="LIPS-2025-DKR-000124"
                      className="pl-10 font-mono text-base h-12 border-lips-green/20 focus:border-lips-green"
                      disabled={loading}
                    />
                  </div>
                  <Button
                    onClick={handleVerify}
                    disabled={loading}
                    className="bg-lips-green hover:bg-lips-green-dark text-white h-12 px-6"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Shield className="h-4 w-4 mr-2" />
                    )}
                    {loading ? '' : 'Vérifier'}
                  </Button>
                </div>

                {/* Live preview of parsed matricule */}
                {parsed && matchedRegion && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-3 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3"
                  >
                    <QrCode className="h-4 w-4 text-lips-green" />
                    <span>
                      Année : <strong>{parsed.year}</strong> | Région :{' '}
                      <strong>
                        {matchedRegion.nom} ({matchedRegion.nomAr})
                      </strong>{' '}
                      | N° : <strong>{parsed.sequential}</strong>
                    </span>
                  </motion.div>
                )}

                {/* Error display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3 border border-red-200"
                  >
                    <XCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </motion.div>
                )}

                {/* Result display */}
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {(() => {
                      const config = getStatusConfig(result.status);
                      const StatusIcon = config.icon;
                      return (
                        <div
                          className={`${config.bg} ${config.border} border rounded-xl p-5`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <StatusIcon
                                className={`h-5 w-5 ${config.color}`}
                              />
                              <span
                                className={`font-semibold ${config.color}`}
                              >
                                {config.label}
                              </span>
                            </div>
                            <Badge
                              variant={config.badgeVariant}
                              className={config.badgeClass}
                            >
                              {result.status === 'valid'
                                ? 'ACTIF'
                                : result.status === 'expired'
                                  ? 'EXPIRÉ'
                                  : result.status === 'pending'
                                    ? 'EN ATTENTE'
                                    : 'NON TROUVÉ'}
                            </Badge>
                          </div>

                          {result.data && (
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="text-xs text-muted-foreground">
                                    Nom
                                  </div>
                                  <div className="font-medium">
                                    {result.data.nom}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="text-xs text-muted-foreground">
                                    Région
                                  </div>
                                  <div className="font-medium">
                                    {result.data.region}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="text-xs text-muted-foreground">
                                    Rôle
                                  </div>
                                  <div className="font-medium">
                                    {result.data.role}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="text-xs text-muted-foreground">
                                    Validité
                                  </div>
                                  <div className="font-medium">
                                    {result.data.validite}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </motion.div>
                )}

                {/* Format hint */}
                <div className="text-center text-xs text-muted-foreground">
                  Format : LIPS-[Année]-[Région]-[N°] — Exemple : LIPS-2025-DKR-000124
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

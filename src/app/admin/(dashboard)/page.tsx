'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BadgeDollarSign,
  Building2,
  Clock,
  CheckCircle2,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStats {
  totalMembres: number;
  membresEnAttente: number;
  totalRegions: number;
  commissionsActives: number;
  recentMembers: { nom: string; prenom: string; region: { nom: string }; status: string; createdAt: string }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembres: 0,
    membresEnAttente: 0,
    totalRegions: 14,
    commissionsActives: 0,
    recentMembers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [membresRes, commissionsRes, recentRes] = await Promise.all([
          fetch('/api/admin/membres?limit=1'),
          fetch('/api/admin/commissions'),
          fetch('/api/admin/membres?limit=5&sort=recent'),
        ]);

        const membresData = await membresRes.json();
        const commissionsData = await commissionsRes.json();
        const recentData = await recentRes.json();

        const membres = membresData.data || [];
        const allMembres = membresData.total ?? membres.length;
        const enAttente = membresData.enAttente ?? 0;
        const commissions = commissionsData.data || [];
        const recent = recentData.data || [];

        setStats({
          totalMembres: allMembres,
          membresEnAttente: enAttente,
          totalRegions: 14,
          commissionsActives: commissions.filter((c: { published: boolean }) => c.published).length,
          recentMembers: recent,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const KPIs = [
    { title: 'Total Membres', value: loading ? '…' : stats.totalMembres.toLocaleString('fr-FR'), icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Adhésions en attente', value: loading ? '…' : stats.membresEnAttente.toLocaleString('fr-FR'), icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Régions couvertes', value: '14', icon: MapPin, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Commissions Actives', value: loading ? '…' : stats.commissionsActives.toString(), icon: Building2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-foreground mb-2">Tableau de Bord</h1>
        <p className="text-muted-foreground text-sm">Aperçu global des activités de la Ligue.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPIs.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{kpi.title}</p>
                    <h3 className="text-2xl font-black text-foreground">{kpi.value}</h3>
                  </div>
                  <div className={`p-3 rounded-2xl ${kpi.bg}`}>
                    <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs font-medium text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Données en temps réel
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Members */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Users className="h-4 w-4 text-lips-green" />
            Derniers Membres Inscrits
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted/40 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : stats.recentMembers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucun membre pour le moment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentMembers.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-lips-green/10 flex items-center justify-center font-bold text-lips-green text-sm">
                      {m.prenom?.[0]}{m.nom?.[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{m.prenom} {m.nom}</h4>
                      <p className="text-xs text-muted-foreground">{m.region?.nom}</p>
                    </div>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    m.status === 'ACTIF' ? 'bg-green-100 text-green-700' :
                    m.status === 'EN_ATTENTE' ? 'bg-orange-100 text-orange-700' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {m.status === 'ACTIF' ? 'Actif' : m.status === 'EN_ATTENTE' ? 'En attente' : m.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info card */}
      <Card className="border-lips-green/20 bg-lips-green/5">
        <CardContent className="p-6 flex items-center gap-4">
          <CheckCircle2 className="h-8 w-8 text-lips-green shrink-0" />
          <div>
            <p className="font-bold text-foreground">Base de données Supabase connectée</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Toutes les données sont en temps réel. Les statistiques se mettent à jour automatiquement.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import { motion } from 'framer-motion';
import {
  Users,

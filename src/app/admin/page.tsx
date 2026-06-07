'use client';

import { motion } from 'framer-motion';
import {
  Users,
  BadgeDollarSign,
  TrendingUp,
  Building2,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DONATION_DATA = [
  { month: 'Jan', total: 450000 },
  { month: 'Fév', total: 600000 },
  { month: 'Mar', total: 1200000 },
  { month: 'Avr', total: 950000 },
  { month: 'Mai', total: 1500000 },
  { month: 'Juin', total: 2100000 },
];

const REGION_DATA = [
  { region: 'Dakar', membres: 1200 },
  { region: 'Thiès', membres: 850 },
  { region: 'Saint-Louis', membres: 600 },
  { region: 'Kaolack', membres: 450 },
  { region: 'Ziguinchor', membres: 300 },
];

export default function AdminDashboardPage() {
  const KPIs = [
    { title: 'Total Membres', value: '5,240', change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Dons (Ce mois)', value: '2.1M FCFA', change: '+24%', icon: BadgeDollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Adhésions en attente', value: '45', change: '-5', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Commissions Actives', value: '8', change: 'Stable', icon: Building2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
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
                <div className="mt-4 flex items-center text-xs font-medium text-emerald-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {kpi.change} depuis le mois dernier
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Évolution des Dons (2025)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-end justify-between gap-3 pt-12 pb-2">
              {DONATION_DATA.map((data, i) => {
                const max = Math.max(...DONATION_DATA.map(d => d.total));
                const height = `${(data.total / max) * 100}%`;
                return (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1 group h-full">
                    <div className="relative w-full h-full flex flex-col justify-end items-center rounded-t-lg bg-muted/10 hover:bg-muted/30 transition-colors">
                      <div 
                        className="w-full bg-gradient-to-t from-lips-gold/20 to-lips-gold rounded-t-md transition-all duration-700 ease-out group-hover:brightness-110"
                        style={{ height }}
                      />
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-foreground bg-background shadow-lg border border-border px-2 py-1 rounded z-10 pointer-events-none">
                        {(data.total / 1000).toLocaleString('fr-FR')}k
                      </div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Membres par Région (Top 5)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex flex-col justify-between py-4">
              {REGION_DATA.map((data, i) => {
                const max = Math.max(...REGION_DATA.map(d => d.membres));
                const width = `${(data.membres / max) * 100}%`;
                return (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-24 text-xs font-semibold text-muted-foreground truncate">{data.region}</div>
                    <div className="flex-1 h-8 bg-muted/10 rounded-r-md relative flex items-center group-hover:bg-muted/20 transition-colors">
                      <div 
                        className="h-full bg-[#0A2E17] rounded-r-md transition-all duration-700 ease-out group-hover:brightness-110"
                        style={{ width }}
                      />
                      <span className="ml-3 text-xs font-bold text-foreground">{data.membres.toLocaleString('fr-FR')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">Dernières Inscriptions Validées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Oustaz Mamadou Sy', region: 'Dakar', role: 'Imam', time: 'Il y a 2 heures' },
              { name: 'Cheikh Ahmadou Bamba', region: 'Thiès', role: 'Prédicateur', time: 'Il y a 5 heures' },
              { name: 'Imam Alioune Badara', region: 'Saint-Louis', role: 'Membre', time: 'Il y a 1 jour' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-lips-green/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-lips-green" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{activity.name}</h4>
                    <p className="text-xs text-muted-foreground">{activity.role} • {activity.region}</p>
                  </div>
                </div>
                <div className="text-xs font-medium text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

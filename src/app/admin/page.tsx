'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Users,
  UserCheck,
  FileText,
  Globe,
  Heart,
  CreditCard,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DashboardData {
  stats: {
    totalMembers: number
    activeMembers: number
    publishedContents: number
    totalRegions: number
    donsCeMois: number
    cotisationsCeMois: number
  }
  recentContents: Array<{
    id: number
    titre: string
    type: string
    published: boolean
    createdAt: string
  }>
  recentMembers: Array<{
    id: number
    nom: string
    prenom: string
    matricule: string
    role: string
    status: string
    createdAt: string
    region: { nom: string } | null
  }>
  membersByRegion: Array<{
    nom: string
    code: string
    members: number
  }>
}

const typeLabels: Record<string, string> = {
  COMMUNIQUE: 'Communiqué',
  ARTICLE: 'Article',
  FATWA: 'Fatwa',
  EVENEMENT: 'Événement',
  SEMINAIRE: 'Séminaire',
  COURS: 'Cours',
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'destructive' | 'secondary' | 'outline' }> = {
  ACTIF: { label: 'Actif', variant: 'default' },
  EXPIRE: { label: 'Expiré', variant: 'destructive' },
  EN_ATTENTE: { label: 'En attente', variant: 'secondary' },
}

const roleLabels: Record<string, string> = {
  IMAM: 'Imam',
  PREDICATEUR: 'Prédicateur',
  RESPONSABLE_REGIONAL: 'Resp. Régional',
  ADMIN: 'Admin',
  PRESIDENT: 'Président',
  MEMBRE_CHOURA: 'Membre Choura',
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-lips-green-dark">Tableau de Bord</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-100 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!data) return null

  const statCards = [
    {
      title: 'Total Membres',
      value: data.stats.totalMembers,
      icon: Users,
      color: 'text-lips-green',
      bg: 'bg-lips-green/10',
    },
    {
      title: 'Membres Actifs',
      value: data.stats.activeMembers,
      icon: UserCheck,
      color: 'text-lips-emerald',
      bg: 'bg-lips-emerald/10',
    },
    {
      title: 'Contenus Publiés',
      value: data.stats.publishedContents,
      icon: FileText,
      color: 'text-lips-gold',
      bg: 'bg-lips-gold/10',
    },
    {
      title: 'Régions',
      value: data.stats.totalRegions,
      icon: Globe,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Dons ce mois',
      value: data.stats.donsCeMois,
      icon: Heart,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
    {
      title: 'Cotisations',
      value: data.stats.cotisationsCeMois,
      icon: CreditCard,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-lips-green-dark">Tableau de Bord</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Vue d&apos;ensemble du système LIPS
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/contenus">
            <Button size="sm" className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
              <Plus className="h-4 w-4" />
              Nouveau contenu
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members by Region Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-lips-green" />
              Membres par Région
            </CardTitle>
            <CardDescription>Répartition des membres à travers les régions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.membersByRegion} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="code"
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: number) => [`${value} membres`, 'Membres']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Bar dataKey="members" fill="#1B6B3A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="space-y-6">
          {/* Recent Content */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-lips-gold" />
                  Contenus récents
                </CardTitle>
                <Link href="/admin/contenus">
                  <Button variant="ghost" size="sm" className="text-lips-green gap-1">
                    Voir tout <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recentContents.map((content) => (
                  <div key={content.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{content.titre}</p>
                      <p className="text-xs text-muted-foreground">
                        {typeLabels[content.type] || content.type}
                      </p>
                    </div>
                    <Badge variant={content.published ? 'default' : 'secondary'} className="ml-2 shrink-0">
                      {content.published ? 'Publié' : 'Brouillon'}
                    </Badge>
                  </div>
                ))}
                {data.recentContents.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucun contenu récent
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Members */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-lips-emerald" />
                  Membres récents
                </CardTitle>
                <Link href="/admin/membres">
                  <Button variant="ghost" size="sm" className="text-lips-green gap-1">
                    Voir tout <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recentMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {member.prenom} {member.nom}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {roleLabels[member.role] || member.role} — {member.region?.nom || 'N/A'}
                      </p>
                    </div>
                    <Badge
                      variant={statusLabels[member.status]?.variant || 'secondary'}
                      className="ml-2 shrink-0"
                    >
                      {statusLabels[member.status]?.label || member.status}
                    </Badge>
                  </div>
                ))}
                {data.recentMembers.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucun membre récent
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

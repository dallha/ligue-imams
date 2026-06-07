'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Headphones, Mic } from 'lucide-react'
import { toast } from 'sonner'

// Components
import { RecitersTab } from './_components/reciters-tab'
import { VersesTab } from './_components/verses-tab'
import { ResourcesTab } from './_components/resources-tab'

type TabKey = 'recitateurs' | 'versets' | 'ressources'

export default function AdminCoranPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('recitateurs')
  const [mounted, setMounted] = useState(false)

  // Counts for tabs
  const [counts, setCounts] = useState({ recitateurs: 0, versets: 0, ressources: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchCounts = useCallback(async () => {
    try {
      const [r, v, rs] = await Promise.all([
        fetch('/api/admin/coran/reciters').then(res => res.json()),
        fetch('/api/admin/coran/versets').then(res => res.json()),
        fetch('/api/admin/coran/ressources').then(res => res.json())
      ])
      setCounts({
        recitateurs: r.data?.length || 0,
        versets: v.data?.length || 0,
        ressources: rs.data?.length || 0
      })
    } catch {
      // Silently fail counts
    }
  }, [])

  useEffect(() => {
    fetchCounts()
  }, [fetchCounts])

  const tabConfig = [
    { key: 'recitateurs' as TabKey, label: 'Récitateurs', icon: Headphones, count: counts.recitateurs },
    { key: 'versets' as TabKey, label: 'Versets du Jour', icon: BookOpen, count: counts.versets },
    { key: 'ressources' as TabKey, label: 'Ressources', icon: Mic, count: counts.ressources },
  ]

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion du Coran</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez les récitateurs, les versets du jour et les ressources coraniques
          </p>
        </div>
        <Card><CardContent className="p-8 text-center text-muted-foreground">Chargement...</CardContent></Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion du Coran</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez les récitateurs, les versets du jour et les ressources coraniques
          </p>
        </div>
      </div>

      {/* Custom Tab Navigation */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit">
        {tabConfig.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                isActive
                  ? 'bg-lips-green text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <Badge
                variant={isActive ? 'secondary' : 'outline'}
                className={`text-[10px] px-1.5 ${isActive ? 'bg-white/20 text-white border-0' : ''}`}
              >
                {tab.count}
              </Badge>
            </button>
          )
        })}
      </div>

      {/* Rendering Active Tab */}
      {activeTab === 'recitateurs' && <RecitersTab />}
      {activeTab === 'versets' && <VersesTab />}
      {activeTab === 'ressources' && <ResourcesTab />}
    </div>
  )
}

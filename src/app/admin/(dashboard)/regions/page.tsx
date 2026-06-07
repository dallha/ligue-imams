'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Edit, MapPin, Users, Building } from 'lucide-react'
import { toast } from 'sonner'

interface RegionItem {
  id: number
  code: string
  nom: string
  nomAr: string | null
  population: number | null
  mosqueCount: number | null
  latitude: number | null
  longitude: number | null
  _count: { members: number; mosques: number }
}

export default function RegionsPage() {
  const [regions, setRegions] = useState<RegionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editRegion, setEditRegion] = useState<RegionItem | null>(null)
  const [form, setForm] = useState({
    nom: '',
    nomAr: '',
    population: '',
    mosqueCount: '',
    latitude: '',
    longitude: '',
  })
  const [saving, setSaving] = useState(false)

  const fetchRegions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/regions')
      const data = await res.json()
      setRegions(data.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors du chargement des régions')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRegions()
  }, [fetchRegions])

  function openEdit(region: RegionItem) {
    setEditRegion(region)
    setForm({
      nom: region.nom,
      nomAr: region.nomAr || '',
      population: region.population?.toString() || '',
      mosqueCount: region.mosqueCount?.toString() || '',
      latitude: region.latitude?.toString() || '',
      longitude: region.longitude?.toString() || '',
    })
  }

  async function handleSave() {
    if (!editRegion) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/regions/${editRegion.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: form.nom,
          nomAr: form.nomAr || null,
          population: form.population ? parseInt(form.population) : null,
          mosqueCount: form.mosqueCount ? parseInt(form.mosqueCount) : null,
          latitude: form.latitude ? parseFloat(form.latitude) : null,
          longitude: form.longitude ? parseFloat(form.longitude) : null,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Région mise à jour avec succès')
      setEditRegion(null)
      fetchRegions()
    } catch {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestion des Régions</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Modifier les informations des régions (suppression non autorisée)
        </p>
      </div>

      {/* Regions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Nom (Arabe)</TableHead>
                  <TableHead>Population</TableHead>
                  <TableHead>Mosquées</TableHead>
                  <TableHead>Membres</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : regions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucune région trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  regions.map((region) => (
                    <TableRow key={region.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {region.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{region.nom}</TableCell>
                      <TableCell className="text-muted-foreground font-arabic" dir="rtl">
                        {region.nomAr || '—'}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          {region.population?.toLocaleString() || '—'}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3 text-muted-foreground" />
                          {region.mosqueCount ?? region._count.mosques}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {region._count.members}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(region)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Region Dialog */}
      <Dialog open={editRegion !== null} onOpenChange={() => setEditRegion(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier la région</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la région {editRegion?.code}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nomAr">Nom (Arabe)</Label>
                <Input
                  id="nomAr"
                  value={form.nomAr}
                  onChange={(e) => setForm({ ...form, nomAr: e.target.value })}
                  dir="rtl"
                  className="font-arabic"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="population">Population</Label>
                <Input
                  id="population"
                  type="number"
                  value={form.population}
                  onChange={(e) => setForm({ ...form, population: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mosqueCount">Nombre de mosquées</Label>
                <Input
                  id="mosqueCount"
                  type="number"
                  value={form.mosqueCount}
                  onChange={(e) => setForm({ ...form, mosqueCount: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRegion(null)}>Annuler</Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-lips-green hover:bg-lips-green-dark text-white"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

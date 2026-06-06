'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Plus,
  Edit,
  Trash2,
  Trophy,
  Eye,
  EyeOff,
  CalendarDays,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'

// --- Types ---

interface ConcoursItem {
  id: number
  nom: string
  type: string
  dateDebut: string
  dateFin: string | null
  lieu: string | null
  description: string | null
  descriptionAr: string | null
  participantsEst: number | null
  visiblePublic: boolean
  inscriptionsOuvertes: boolean
  statut: string
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

type ConcoursType = 'CONCOURS_CORAN' | 'CONCOURS_HADITH' | 'CONCOURS_MEMORISATION' | 'QUIZ_ISLAMIQUE'
type ConcoursStatut = 'PLANIFIE' | 'EN_COURS' | 'TERMINE'

// --- Constants ---

const TYPE_LABELS: Record<ConcoursType, string> = {
  CONCOURS_CORAN: 'Concours Coranique',
  CONCOURS_HADITH: 'Concours de Hadith',
  CONCOURS_MEMORISATION: 'Concours de Mémorisation',
  QUIZ_ISLAMIQUE: 'Quiz Islamique',
}

const STATUT_LABELS: Record<ConcoursStatut, string> = {
  PLANIFIE: 'Planifié',
  EN_COURS: 'En cours',
  TERMINE: 'Terminé',
}

const STATUT_COLORS: Record<ConcoursStatut, string> = {
  PLANIFIE: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  EN_COURS: 'bg-green-100 text-green-800 hover:bg-green-100',
  TERMINE: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
}

const TYPE_COLORS: Record<ConcoursType, string> = {
  CONCOURS_CORAN: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  CONCOURS_HADITH: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  CONCOURS_MEMORISATION: 'bg-teal-100 text-teal-800 hover:bg-teal-100',
  QUIZ_ISLAMIQUE: 'bg-rose-100 text-rose-800 hover:bg-rose-100',
}

const emptyForm = {
  nom: '',
  type: 'CONCOURS_CORAN' as ConcoursType,
  dateDebut: '',
  dateFin: '',
  lieu: '',
  description: '',
  participantsEst: '',
  visiblePublic: false,
  inscriptionsOuvertes: false,
  statut: 'PLANIFIE' as ConcoursStatut,
}

// --- Helper ---

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// --- Component ---

export default function ConcoursPage() {
  const [concours, setConcours] = useState<ConcoursItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchConcours = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/concours')
      const data = await res.json()
      setConcours(data.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConcours()
  }, [fetchConcours])

  // --- Stats ---

  const stats = {
    total: concours.length,
    enCours: concours.filter((c) => c.statut === 'EN_COURS').length,
    planifies: concours.filter((c) => c.statut === 'PLANIFIE').length,
    termines: concours.filter((c) => c.statut === 'TERMINE').length,
  }

  // --- Actions ---

  function openCreate() {
    setEditingId(null)
    setForm({ ...emptyForm })
    setDialogOpen(true)
  }

  function openEdit(item: ConcoursItem) {
    setEditingId(item.id)
    setForm({
      nom: item.nom,
      type: item.type as ConcoursType,
      dateDebut: item.dateDebut ? new Date(item.dateDebut).toISOString().split('T')[0] : '',
      dateFin: item.dateFin ? new Date(item.dateFin).toISOString().split('T')[0] : '',
      lieu: item.lieu || '',
      description: item.description || '',
      participantsEst: item.participantsEst?.toString() || '',
      visiblePublic: item.visiblePublic,
      inscriptionsOuvertes: item.inscriptionsOuvertes,
      statut: item.statut as ConcoursStatut,
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.nom || !form.type || !form.dateDebut) {
      toast.error('Nom, type et date de début sont requis')
      return
    }
    setSaving(true)
    try {
      const body = {
        nom: form.nom,
        type: form.type,
        dateDebut: form.dateDebut,
        dateFin: form.dateFin || null,
        lieu: form.lieu || null,
        description: form.description || null,
        participantsEst: form.participantsEst ? parseInt(form.participantsEst) : null,
        visiblePublic: form.visiblePublic,
        inscriptionsOuvertes: form.inscriptionsOuvertes,
        statut: form.statut,
      }

      if (editingId) {
        const res = await fetch(`/api/admin/concours/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error()
        toast.success('Concours mis à jour')
      } else {
        const res = await fetch('/api/admin/concours', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error()
        toast.success('Concours créé')
      }

      setDialogOpen(false)
      fetchConcours()
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/concours/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Concours supprimé')
      setDeleteId(null)
      fetchConcours()
    } catch {
      toast.error('Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  async function toggleVisibility(item: ConcoursItem) {
    try {
      const res = await fetch(`/api/admin/concours/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visiblePublic: !item.visiblePublic }),
      })
      if (!res.ok) throw new Error()
      toast.success(item.visiblePublic ? 'Concours masqué publiquement' : 'Concours rendu public')
      fetchConcours()
    } catch {
      toast.error('Erreur lors du changement de visibilité')
    }
  }

  // --- Render ---

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-lips-green-dark">Gestion des Concours</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Organisez et gérez les concours coraniques, de hadith et autres activités compétitives
          </p>
        </div>
        <Button onClick={openCreate} className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Concours
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-lips-green">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-lips-green/10">
                <Trophy className="h-5 w-5 text-lips-green" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Concours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.enCours}</p>
                <p className="text-xs text-muted-foreground">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.planifies}</p>
                <p className="text-xs text-muted-foreground">Planifiés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-400">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <CalendarDays className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.termines}</p>
                <p className="text-xs text-muted-foreground">Terminés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Concours Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du concours</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date début</TableHead>
                  <TableHead className="hidden lg:table-cell">Date fin</TableHead>
                  <TableHead className="hidden md:table-cell">Lieu</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : concours.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center">
                        <Trophy className="h-8 w-8 text-muted-foreground/50 mb-2" />
                        Aucun concours
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  concours.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium text-sm max-w-xs">
                        <p className="line-clamp-2">{item.nom}</p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${TYPE_COLORS[item.type as ConcoursType] || ''}`}
                        >
                          {TYPE_LABELS[item.type as ConcoursType] || item.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {formatDate(item.dateDebut)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm whitespace-nowrap">
                        {formatDate(item.dateFin)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        <div className="flex items-center gap-1">
                          {item.lieu ? (
                            <>
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span>{item.lieu}</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${STATUT_COLORS[item.statut as ConcoursStatut] || ''}`}
                        >
                          {STATUT_LABELS[item.statut as ConcoursStatut] || item.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={item.visiblePublic}
                            onCheckedChange={() => toggleVisibility(item)}
                            className="data-[state=checked]:bg-lips-green"
                          />
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            {item.visiblePublic ? 'Oui' : 'Non'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleVisibility(item)}
                            title={item.visiblePublic ? 'Masquer publiquement' : 'Rendre public'}
                          >
                            {item.visiblePublic ? (
                              <Eye className="h-4 w-4 text-lips-green" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Modifier le concours' : 'Nouveau concours'}</DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Modifiez les informations du concours'
                : 'Créez un nouveau concours compétitif'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Nom */}
            <div className="space-y-2">
              <Label>Nom du concours *</Label>
              <Input
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                placeholder="Ex: 7e Concours de Mémorisation du Saint Coran"
              />
            </div>

            {/* Type & Statut */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm({ ...form, type: v as ConcoursType })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONCOURS_CORAN">Concours Coranique</SelectItem>
                    <SelectItem value="CONCOURS_HADITH">Concours de Hadith</SelectItem>
                    <SelectItem value="CONCOURS_MEMORISATION">Concours de Mémorisation</SelectItem>
                    <SelectItem value="QUIZ_ISLAMIQUE">Quiz Islamique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select
                  value={form.statut}
                  onValueChange={(v) => setForm({ ...form, statut: v as ConcoursStatut })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLANIFIE">Planifié</SelectItem>
                    <SelectItem value="EN_COURS">En cours</SelectItem>
                    <SelectItem value="TERMINE">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date début *</Label>
                <Input
                  type="date"
                  value={form.dateDebut}
                  onChange={(e) => setForm({ ...form, dateDebut: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Date fin</Label>
                <Input
                  type="date"
                  value={form.dateFin}
                  onChange={(e) => setForm({ ...form, dateFin: e.target.value })}
                />
              </div>
            </div>

            {/* Lieu & Participants */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lieu</Label>
                <Input
                  value={form.lieu}
                  onChange={(e) => setForm({ ...form, lieu: e.target.value })}
                  placeholder="Ex: Dakar"
                />
              </div>
              <div className="space-y-2">
                <Label>Participants estimé</Label>
                <Input
                  type="number"
                  value={form.participantsEst}
                  onChange={(e) => setForm({ ...form, participantsEst: e.target.value })}
                  placeholder="Ex: 200"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description du concours..."
                rows={3}
              />
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Visible publiquement</Label>
                  <p className="text-xs text-muted-foreground">
                    Afficher ce concours sur le site public
                  </p>
                </div>
                <Switch
                  checked={form.visiblePublic}
                  onCheckedChange={(v) => setForm({ ...form, visiblePublic: v })}
                  className="data-[state=checked]:bg-lips-green"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Inscriptions ouvertes</Label>
                  <p className="text-xs text-muted-foreground">
                    Autoriser les inscriptions en ligne
                  </p>
                </div>
                <Switch
                  checked={form.inscriptionsOuvertes}
                  onCheckedChange={(v) => setForm({ ...form, inscriptionsOuvertes: v })}
                  className="data-[state=checked]:bg-lips-green"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-lips-green hover:bg-lips-green-dark text-white"
            >
              {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce concours ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

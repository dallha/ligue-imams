'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Search, Filter, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'

interface MemberItem {
  id: number
  matricule: string
  email: string
  nom: string
  prenom: string
  telephone: string
  role: string
  status: string
  regionId: number
  region: { nom: string; code: string } | null
  createdAt: string
}

interface Region {
  id: number
  code: string
  nom: string
}

const roleOptions = [
  { value: 'IMAM', label: 'Imam' },
  { value: 'PREDICATEUR', label: 'Prédicateur' },
  { value: 'RESPONSABLE_REGIONAL', label: 'Responsable Régional' },
  { value: 'MEMBRE_CHOURA', label: 'Membre Choura' },
]

const statusOptions = [
  { value: 'ACTIF', label: 'Actif' },
  { value: 'EXPIRE', label: 'Expiré' },
  { value: 'EN_ATTENTE', label: 'En attente' },
]

const statusVariants: Record<string, 'default' | 'destructive' | 'secondary'> = {
  ACTIF: 'default',
  EXPIRE: 'destructive',
  EN_ATTENTE: 'secondary',
}

const roleLabels: Record<string, string> = Object.fromEntries(
  roleOptions.map((o) => [o.value, o.label])
)

export default function MembresPage() {
  const [members, setMembers] = useState<MemberItem[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRegion, setFilterRegion] = useState('all')
  const [page, setPage] = useState(1)
  const limit = 15

  const [detailMember, setDetailMember] = useState<MemberItem | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [editRole, setEditRole] = useState('')
  const [saving, setSaving] = useState(false)

  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (filterRole !== 'all') params.set('role', filterRole)
      if (filterStatus !== 'all') params.set('status', filterStatus)
      if (filterRegion !== 'all') params.set('regionId', filterRegion)
      params.set('page', page.toString())
      params.set('limit', limit.toString())

      const res = await fetch(`/api/admin/membres?${params}`)
      const data = await res.json()
      setMembers(data.data || [])
      setTotal(data.total || 0)
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors du chargement des membres')
    } finally {
      setLoading(false)
    }
  }, [search, filterRole, filterStatus, filterRegion, page])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  useEffect(() => {
    fetch('/api/admin/regions')
      .then((res) => res.json())
      .then((data) => setRegions(data.data || []))
      .catch(console.error)
  }, [])

  function openDetail(member: MemberItem) {
    setDetailMember(member)
    setEditStatus(member.status)
    setEditRole(member.role)
  }

  async function handleSaveStatus() {
    if (!detailMember) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/membres/${detailMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: editStatus, role: editRole }),
      })
      if (!res.ok) throw new Error()
      toast.success('Membre mis à jour avec succès')
      setDetailMember(null)
      fetchMembers()
    } catch {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/membres/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Membre supprimé avec succès')
      setDeleteId(null)
      fetchMembers()
    } catch {
      toast.error('Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-lips-green-dark">Gestion des Membres</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gérez les membres de la LIPS
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, matricule, email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={(v) => { setFilterRole(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-44">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                {roleOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {statusOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterRegion} onValueChange={(v) => { setFilterRegion(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Région" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les régions</SelectItem>
                {regions.map((r) => (
                  <SelectItem key={r.id} value={r.id.toString()}>{r.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Région</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Email</TableHead>
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
                ) : members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucun membre trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => (
                    <TableRow key={member.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-mono text-xs">{member.matricule}</TableCell>
                      <TableCell>
                        <p className="font-medium text-sm">{member.prenom} {member.nom}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {roleLabels[member.role] || member.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {member.region?.nom || '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[member.status] || 'secondary'} className="text-xs">
                          {statusOptions.find((s) => s.value === member.status)?.label || member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground truncate max-w-32">
                        {member.email}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openDetail(member)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteId(member.id)}>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                {total} résultat(s) — Page {page}/{totalPages}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  Précédent
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Member Detail Dialog */}
      <Dialog open={detailMember !== null} onOpenChange={() => setDetailMember(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails du membre</DialogTitle>
            <DialogDescription>Informations et modification du statut</DialogDescription>
          </DialogHeader>

          {detailMember && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Matricule</p>
                  <p className="font-mono text-sm font-bold">{detailMember.matricule}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Nom complet</p>
                  <p className="text-sm font-medium">{detailMember.prenom} {detailMember.nom}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm">{detailMember.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Téléphone</p>
                  <p className="text-sm">{detailMember.telephone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Région</p>
                  <p className="text-sm">{detailMember.region?.nom || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Inscription</p>
                  <p className="text-sm">{new Date(detailMember.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rôle</Label>
                  <Select value={editRole} onValueChange={setEditRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailMember(null)}>Annuler</Button>
            <Button
              onClick={handleSaveStatus}
              disabled={saving}
              className="bg-lips-green hover:bg-lips-green-dark text-white"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
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
              Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible.
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

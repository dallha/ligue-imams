'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { Plus, Edit, Trash2, GripVertical, UserCircle } from 'lucide-react'
import { toast } from 'sonner'

interface BureauMemberItem {
  id: number
  nom: string
  prenom: string
  role: string
  roleAr: string | null
  region: string | null
  bio: string | null
  initiales: string | null
  photo: string | null
  ordre: number
}

const emptyForm = {
  nom: '',
  prenom: '',
  role: '',
  roleAr: '',
  region: '',
  bio: '',
  initiales: '',
  photo: '',
  ordre: 0,
}

export default function BureauPage() {
  const [members, setMembers] = useState<BureauMemberItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/bureau')
      const data = await res.json()
      setMembers(data.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  function openCreate() {
    setEditingId(null)
    setForm({ ...emptyForm, ordre: members.length })
    setDialogOpen(true)
  }

  function openEdit(member: BureauMemberItem) {
    setEditingId(member.id)
    setForm({
      nom: member.nom,
      prenom: member.prenom,
      role: member.role,
      roleAr: member.roleAr || '',
      region: member.region || '',
      bio: member.bio || '',
      initiales: member.initiales || '',
      photo: member.photo || '',
      ordre: member.ordre,
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.nom || !form.prenom || !form.role) {
      toast.error('Nom, prénom et rôle sont requis')
      return
    }
    setSaving(true)
    try {
      const body = {
        ...form,
        roleAr: form.roleAr || null,
        region: form.region || null,
        bio: form.bio || null,
        initiales: form.initiales || null,
        photo: form.photo || null,
      }

      if (editingId) {
        const res = await fetch(`/api/admin/bureau/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error()
        toast.success('Membre mis à jour')
      } else {
        const res = await fetch('/api/admin/bureau', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error()
        toast.success('Membre ajouté')
      }

      setDialogOpen(false)
      fetchMembers()
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
      const res = await fetch(`/api/admin/bureau/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Membre supprimé')
      setDeleteId(null)
      fetchMembers()
    } catch {
      toast.error('Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-lips-green-dark">Bureau National</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Membres du bureau national de la LIPS
          </p>
        </div>
        <Button onClick={openCreate} className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un membre
        </Button>
      </div>

      {/* Members Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-100 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : members.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <UserCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucun membre du bureau</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 border-2 border-lips-green/20">
                    <AvatarFallback className="bg-lips-green/10 text-lips-green font-bold">
                      {member.initiales || `${member.prenom[0]}${member.nom[0]}`}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">
                      {member.prenom} {member.nom}
                    </h3>
                    <p className="text-sm text-lips-green font-medium">{member.role}</p>
                    {member.roleAr && (
                      <p className="text-xs text-muted-foreground font-arabic" dir="rtl">
                        {member.roleAr}
                      </p>
                    )}
                    {member.region && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {member.region}
                      </Badge>
                    )}
                    {member.bio && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {member.bio}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">Ordre: {member.ordre}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(member)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(member.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Modifier le membre' : 'Ajouter un membre'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Modifiez les informations du membre' : 'Remplissez les informations pour ajouter un membre'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prénom *</Label>
                <Input
                  value={form.prenom}
                  onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                  placeholder="Prénom"
                />
              </div>
              <div className="space-y-2">
                <Label>Nom *</Label>
                <Input
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  placeholder="Nom"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rôle *</Label>
                <Input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Président, Secrétaire..."
                />
              </div>
              <div className="space-y-2">
                <Label>Rôle (Arabe)</Label>
                <Input
                  value={form.roleAr}
                  onChange={(e) => setForm({ ...form, roleAr: e.target.value })}
                  dir="rtl"
                  className="font-arabic"
                  placeholder="المنصب"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Région</Label>
                <Input
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  placeholder="Région"
                />
              </div>
              <div className="space-y-2">
                <Label>Initiales</Label>
                <Input
                  value={form.initiales}
                  onChange={(e) => setForm({ ...form, initiales: e.target.value })}
                  placeholder="AB"
                  maxLength={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Biographie</Label>
              <Textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Biographie du membre..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Photo URL</Label>
                <Input
                  value={form.photo}
                  onChange={(e) => setForm({ ...form, photo: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Ordre</Label>
                <Input
                  type="number"
                  value={form.ordre}
                  onChange={(e) => setForm({ ...form, ordre: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-lips-green hover:bg-lips-green-dark text-white"
            >
              {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Ajouter'}
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
              Êtes-vous sûr de vouloir supprimer ce membre du bureau ? Cette action est irréversible.
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

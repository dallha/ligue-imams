'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Edit,
  Trash2,
  CalendarDays,
  Eye,
  EyeOff,
  MapPin,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────

type EventType = 'LIPS' | 'ISLAMIQUE' | 'FORMATION' | 'COMMUNAUTE';

interface EventItem {
  id: number;
  titre: string;
  titreAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  dateDebut: string;
  dateFin: string | null;
  lieu: string | null;
  type: string;
  categorie: string | null;
  published: boolean;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Constants ────────────────────────────────────────────────────

const TYPE_OPTIONS: EventType[] = ['LIPS', 'ISLAMIQUE', 'FORMATION', 'COMMUNAUTE'];

const TYPE_COLORS: Record<string, string> = {
  LIPS: 'bg-lips-green/10 text-lips-green',
  ISLAMIQUE: 'bg-lips-gold/10 text-lips-gold',
  FORMATION: 'bg-lips-emerald/10 text-lips-emerald',
  COMMUNAUTE: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
};

const TYPE_LABELS: Record<string, string> = {
  LIPS: 'LIPS',
  ISLAMIQUE: 'Islamique',
  FORMATION: 'Formation',
  COMMUNAUTE: 'Communauté',
};

const emptyForm = {
  titre: '',
  titreAr: '',
  description: '',
  descriptionAr: '',
  dateDebut: '',
  dateFin: '',
  lieu: '',
  type: 'LIPS' as EventType,
  categorie: '',
  published: true,
  imageUrl: '',
};

export default function AdminAgendaPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ─── Fetch events ──────────────────────────────────────────────

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/agenda');
      const data = await res.json();
      setEvents(data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // ─── Dialog helpers ────────────────────────────────────────────

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setDialogOpen(true);
  }

  function openEdit(item: EventItem) {
    setEditingId(item.id);
    setForm({
      titre: item.titre,
      titreAr: item.titreAr || '',
      description: item.description || '',
      descriptionAr: item.descriptionAr || '',
      dateDebut: item.dateDebut ? item.dateDebut.slice(0, 10) : '',
      dateFin: item.dateFin ? item.dateFin.slice(0, 10) : '',
      lieu: item.lieu || '',
      type: (item.type as EventType) || 'LIPS',
      categorie: item.categorie || '',
      published: item.published,
      imageUrl: item.imageUrl || '',
    });
    setDialogOpen(true);
  }

  // ─── Save (create / update) ────────────────────────────────────

  async function handleSave() {
    if (!form.titre || !form.dateDebut) {
      toast.error('Titre et date de début sont requis');
      return;
    }
    setSaving(true);
    try {
      const body = {
        titre: form.titre,
        titreAr: form.titreAr || null,
        description: form.description || null,
        descriptionAr: form.descriptionAr || null,
        dateDebut: form.dateDebut,
        dateFin: form.dateFin || null,
        lieu: form.lieu || null,
        type: form.type,
        categorie: form.categorie || null,
        published: form.published,
        imageUrl: form.imageUrl || null,
      };

      if (editingId) {
        const res = await fetch(`/api/admin/agenda/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        toast.success('Événement mis à jour');
      } else {
        const res = await fetch('/api/admin/agenda', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        toast.success('Événement créé');
      }

      setDialogOpen(false);
      fetchEvents();
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  // ─── Delete ────────────────────────────────────────────────────

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/agenda/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Événement supprimé');
      setDeleteId(null);
      fetchEvents();
    } catch {
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  }

  // ─── Toggle publish ────────────────────────────────────────────

  async function togglePublish(item: EventItem) {
    try {
      const res = await fetch(`/api/admin/agenda/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      });
      if (!res.ok) throw new Error();
      toast.success(item.published ? 'Événement dépublié' : 'Événement publié');
      fetchEvents();
    } catch {
      toast.error('Erreur lors du changement de statut');
    }
  }

  // ─── Formatters ────────────────────────────────────────────────

  function formatDateFR(dateStr: string | null): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // ─── Render ────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion de l&apos;Agenda</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez les événements LIPS, formations et activités communautaires
          </p>
        </div>
        <Button onClick={openCreate} className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un événement
        </Button>
      </div>

      {/* Events Table */}
      <Card>
        <CardContent className="p-0">
          <div className="p-4 flex items-center gap-2 border-b border-border/50">
            <CalendarDays className="h-5 w-5 text-lips-green" />
            <h3 className="font-semibold text-foreground">Événements</h3>
            <Badge variant="secondary" className="text-xs">
              {events.length}
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="hidden md:table-cell">Lieu</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Chargement...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center">
                        <CalendarDays className="h-8 w-8 text-muted-foreground/50 mb-2" />
                        Aucun événement
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-sm max-w-xs">
                        <p className="line-clamp-1">{item.titre}</p>
                        {item.titreAr && (
                          <span className="font-arabic text-xs text-lips-gold">{item.titreAr}</span>
                        )}
                        {item.categorie && (
                          <span className="block text-xs text-muted-foreground mt-0.5">{item.categorie}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>{formatDateFR(item.dateDebut)}</div>
                        {item.dateFin && (
                          <div className="text-xs text-muted-foreground">
                            au {formatDateFR(item.dateFin)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                        {item.lieu ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {item.lieu}
                          </div>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${TYPE_COLORS[item.type] || 'bg-gray-100 text-gray-700'}`}>
                          {TYPE_LABELS[item.type] || item.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.published ? 'default' : 'secondary'} className="text-xs">
                          {item.published ? 'Publié' : 'Brouillon'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePublish(item)}
                            title={item.published ? 'Dépublier' : 'Publier'}
                          >
                            {item.published ? (
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
            <DialogTitle>{editingId ? 'Modifier l\'événement' : 'Nouvel événement'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Modifiez les informations de l\'événement' : 'Ajoutez un nouvel événement'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Titre *</Label>
              <Input
                value={form.titre}
                onChange={(e) => setForm({ ...form, titre: e.target.value })}
                placeholder="Titre de l'événement"
              />
            </div>

            <div className="space-y-2">
              <Label>Titre en arabe</Label>
              <Input
                value={form.titreAr}
                onChange={(e) => setForm({ ...form, titreAr: e.target.value })}
                placeholder="عنوان الحدث"
                dir="rtl"
                className="font-arabic"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de début *</Label>
                <Input
                  type="date"
                  value={form.dateDebut}
                  onChange={(e) => setForm({ ...form, dateDebut: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Input
                  type="date"
                  value={form.dateFin}
                  onChange={(e) => setForm({ ...form, dateFin: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lieu</Label>
                <Input
                  value={form.lieu}
                  onChange={(e) => setForm({ ...form, lieu: e.target.value })}
                  placeholder="Ville ou adresse"
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm({ ...form, type: v as EventType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Input
                value={form.categorie}
                onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                placeholder="ex: Conférence, Séminaire, Assemblée..."
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description de l'événement..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Description en arabe</Label>
              <Textarea
                value={form.descriptionAr}
                onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                placeholder="وصف الحدث..."
                rows={3}
                dir="rtl"
                className="font-arabic"
              />
            </div>

            <div className="space-y-2">
              <Label>URL de l&apos;image</Label>
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.published}
                onCheckedChange={(v) => setForm({ ...form, published: v })}
              />
              <Label>Publié</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
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
              Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.
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
  );
}

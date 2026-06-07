'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Button } from '@/components/ui/button';
import { Search, Filter, Plus, FileText, CheckCircle2, XCircle, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Publication {
  id: number;
  titre: string;
  contenu?: string;
  type: string;
  categorie: string | null;
  published: boolean;
  createdAt: string;
}

const TYPE_LABELS: Record<string, string> = {
  COMMUNIQUE: 'Communiqué',
  ARTICLE: 'Article',
  FATWA: 'Fatwa',
  COURS: 'Cours',
  SEMINAIRE: 'Séminaire',
  EVENEMENT: 'Événement',
};

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 15;

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingPub, setEditingPub] = useState<Publication | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    titre: '',
    type: 'ARTICLE',
    categorie: '',
    contenu: '',
    published: false,
  });

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterType !== 'all') params.set('type', filterType);
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      const res = await fetch(`/api/admin/contenus?${params}`);
      const data = await res.json();
      if (data.data) {
        setPublications(data.data);
        setTotal(data.total);
      }
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors du chargement des publications');
    } finally {
      setLoading(false);
    }
  }, [search, filterType, page]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  const totalPages = Math.ceil(total / limit);

  const openAddModal = () => {
    setEditingPub(null);
    setFormData({ titre: '', type: 'ARTICLE', categorie: '', contenu: '', published: false });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Publication) => {
    setEditingPub(p);
    setFormData({ 
      titre: p.titre, 
      type: p.type, 
      categorie: p.categorie || '', 
      contenu: p.contenu || '',
      published: p.published 
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.titre || !formData.type) {
      toast.error("Veuillez remplir le titre et le type");
      return;
    }

    setSaving(true);
    try {
      const isEdit = !!editingPub;
      const url = isEdit ? `/api/admin/contenus/${editingPub.id}` : `/api/admin/contenus`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Publication ${isEdit ? 'modifiée' : 'créée'} avec succès`);
        setIsModalOpen(false);
        fetchPublications();
      } else {
        toast.error(data.error || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erreur serveur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingPub) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/contenus/${editingPub.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Publication supprimée');
        setIsDeleteOpen(false);
        setDeleteConfirmText('');
        fetchPublications();
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (err) {
      toast.error('Erreur serveur');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Publications & Contenus</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez les articles, communiqués, fatwas et autres contenus du site
          </p>
        </div>
        <Button onClick={openAddModal} className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle publication
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par titre..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-10 bg-background"
              />
            </div>
            <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[200px] bg-background">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type de contenu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {Object.entries(TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Titre</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                    </TableCell>
                  </TableRow>
                ) : publications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      Aucune publication trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  publications.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                            <FileText className="h-4 w-4 text-lips-gold" />
                          </div>
                          <span className="line-clamp-1">{p.titre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs font-semibold bg-background">
                          {TYPE_LABELS[p.type] || p.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground capitalize">
                        {p.categorie || '—'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-center">
                        {p.published ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-transparent gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Publié
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Brouillon
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(p)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { setEditingPub(p); setIsDeleteOpen(true); }}>
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
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-muted/20">
              <p className="text-sm text-muted-foreground font-medium">
                Affichage de {publications.length} sur {total} publications
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)} className="bg-background">
                  Précédent
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="bg-background">
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPub ? 'Modifier la publication' : 'Créer une publication'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Titre principal</Label>
              <Input 
                value={formData.titre} 
                onChange={e => setFormData({...formData, titre: e.target.value})} 
                placeholder="Ex: Nouveaux horaires de prière"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Catégorie (Optionnel)</Label>
                <Input 
                  value={formData.categorie} 
                  onChange={e => setFormData({...formData, categorie: e.target.value})} 
                  placeholder="Ex: Fiqh, Social..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contenu de la publication</Label>
              <Textarea 
                value={formData.contenu}
                onChange={e => setFormData({...formData, contenu: e.target.value})}
                placeholder="Rédigez votre contenu ici..."
                className="min-h-[150px] resize-y"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="space-y-0.5">
                <Label className="text-base">Publier immédiatement</Label>
                <p className="text-sm text-muted-foreground">Rendre visible par tout le monde sur le site public.</p>
              </div>
              <Switch 
                checked={formData.published} 
                onCheckedChange={v => setFormData({...formData, published: v})} 
              />
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-lips-green hover:bg-lips-green-dark text-white">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteOpen} onOpenChange={(open) => { setIsDeleteOpen(open); if (!open) setDeleteConfirmText(''); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Sécurité renforcée : Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                Êtes-vous sûr de vouloir supprimer la publication <strong className="text-foreground">"{editingPub?.titre}"</strong> ?
                Cette action est irréversible.
              </p>
              <div className="space-y-2 mt-4">
                <Label htmlFor="confirmTextPub" className="text-foreground font-semibold">
                  Veuillez retaper le titre exact <span className="font-mono text-red-500">"{editingPub?.titre}"</span> pour confirmer :
                </Label>
                <Input 
                  id="confirmTextPub"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={editingPub?.titre}
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <Button 
              variant="destructive"
              onClick={handleDelete} 
              disabled={saving || deleteConfirmText !== editingPub?.titre} 
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {saving ? 'Suppression...' : 'Supprimer définitivement'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

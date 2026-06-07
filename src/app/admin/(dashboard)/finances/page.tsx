'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
import { Search, Filter, ArrowUpRight, ArrowDownRight, Wallet, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Paiement {
  id: number;
  montant: number;
  type: string;
  methode: string;
  referenceTrans: string;
  datePaiement: string;
  user: {
    nom: string;
    prenom: string;
    matricule: string;
  };
}

const TYPE_COLORS: Record<string, 'default' | 'secondary' | 'outline'> = {
  DON: 'default',
  COTISATION: 'secondary',
  ADHESION: 'outline',
};

export default function FinancesPage() {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 15;

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingPaiement, setEditingPaiement] = useState<Paiement | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    montant: '',
    type: 'DON',
    methode: 'CinetPay',
    userId: '1', // Default for demo
  });

  const fetchPaiements = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterType !== 'all') params.set('type', filterType);
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      const res = await fetch(`/api/admin/finances?${params}`);
      const data = await res.json();
      if (data.success) {
        setPaiements(data.data);
        setTotal(data.total);
      }
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors du chargement des finances');
    } finally {
      setLoading(false);
    }
  }, [search, filterType, page]);

  useEffect(() => {
    fetchPaiements();
  }, [fetchPaiements]);

  const totalPages = Math.ceil(total / limit);

  const openAddModal = () => {
    setEditingPaiement(null);
    setFormData({ montant: '', type: 'DON', methode: 'CinetPay', userId: '1' });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Paiement) => {
    setEditingPaiement(p);
    setFormData({ 
      montant: p.montant.toString(), 
      type: p.type, 
      methode: p.methode, 
      userId: '1' 
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.montant || isNaN(Number(formData.montant))) {
      toast.error("Veuillez entrer un montant valide");
      return;
    }

    setSaving(true);
    try {
      const isEdit = !!editingPaiement;
      const url = isEdit ? `/api/admin/finances/${editingPaiement.id}` : `/api/admin/finances`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Paiement ${isEdit ? 'modifié' : 'ajouté'} avec succès`);
        setIsModalOpen(false);
        fetchPaiements();
      } else {
        toast.error(data.message || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erreur serveur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingPaiement) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/finances/${editingPaiement.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Paiement supprimé avec succès');
        setIsDeleteOpen(false);
        setDeleteConfirmText('');
        fetchPaiements();
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
          <h1 className="text-2xl font-bold text-foreground">Finances & Dons</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez les cotisations, les dons et l'historique financier
          </p>
        </div>
        <Button onClick={openAddModal} className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
          <Wallet className="h-4 w-4" />
          Ajouter un paiement manuel
        </Button>
      </div>

      {/* Stats Cards (Mocked for now) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-card to-muted border-border/50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Dons (Mois)</p>
                <p className="text-3xl font-bold text-foreground">2,145,000 F</p>
              </div>
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <ArrowUpRight className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-muted border-border/50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Cotisations</p>
                <p className="text-3xl font-bold text-foreground">850,000 F</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <ArrowUpRight className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-muted border-border/50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Dépenses</p>
                <p className="text-3xl font-bold text-foreground">125,000 F</p>
              </div>
              <div className="p-2 bg-red-500/10 rounded-lg">
                <ArrowDownRight className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par membre, référence..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-10 bg-background"
              />
            </div>
            <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[200px] bg-background">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type de paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="DON">Don</SelectItem>
                <SelectItem value="COTISATION">Cotisation</SelectItem>
                <SelectItem value="ADHESION">Adhésion</SelectItem>
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
                  <TableHead>Référence</TableHead>
                  <TableHead>Membre</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                    </TableCell>
                  </TableRow>
                ) : paiements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      Aucune transaction trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  paiements.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-xs font-medium">{p.referenceTrans}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">{p.user.prenom} {p.user.nom}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{p.user.matricule}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(p.datePaiement).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs bg-background">
                          {p.methode}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={TYPE_COLORS[p.type] || 'outline'} className="text-[10px] tracking-wider uppercase font-bold">
                          {p.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-foreground">
                        {new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(p.montant)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(p)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { setEditingPaiement(p); setIsDeleteOpen(true); }}>
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
                Affichage de {paiements.length} sur {total} transactions
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPaiement ? 'Modifier le paiement' : 'Ajouter un paiement'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ID Utilisateur</Label>
              <Input 
                value={formData.userId} 
                onChange={e => setFormData({...formData, userId: e.target.value})} 
                disabled={!!editingPaiement}
                placeholder="Ex: 1"
              />
              <p className="text-[10px] text-muted-foreground">Dans un système complet, ceci serait une barre de recherche.</p>
            </div>
            <div className="space-y-2">
              <Label>Montant (FCFA)</Label>
              <Input 
                type="number"
                value={formData.montant} 
                onChange={e => setFormData({...formData, montant: e.target.value})} 
                placeholder="Ex: 10000"
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
                    <SelectItem value="DON">Don</SelectItem>
                    <SelectItem value="COTISATION">Cotisation</SelectItem>
                    <SelectItem value="ADHESION">Adhésion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Méthode</Label>
                <Select value={formData.methode} onValueChange={v => setFormData({...formData, methode: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CinetPay">CinetPay</SelectItem>
                    <SelectItem value="Wave">Wave</SelectItem>
                    <SelectItem value="Espèces">Espèces</SelectItem>
                    <SelectItem value="Chèque">Chèque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                Êtes-vous sûr de vouloir supprimer le paiement <strong className="text-foreground">{editingPaiement?.referenceTrans}</strong> ?
                Cette action est irréversible.
              </p>
              <div className="space-y-2 mt-4">
                <Label htmlFor="confirmText" className="text-foreground font-semibold">
                  Veuillez retaper la référence <span className="font-mono text-red-500">{editingPaiement?.referenceTrans}</span> pour confirmer :
                </Label>
                <Input 
                  id="confirmText"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={editingPaiement?.referenceTrans}
                  className="font-mono"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <Button 
              variant="destructive"
              onClick={handleDelete} 
              disabled={saving || deleteConfirmText !== editingPaiement?.referenceTrans} 
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

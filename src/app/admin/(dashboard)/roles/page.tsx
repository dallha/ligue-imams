'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Shield, ShieldAlert, Plus, Users, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Permission {
  id: number;
  action: string;
  description: string | null;
}

interface Role {
  id: number;
  name: string;
  description: string | null;
  permissions: Permission[];
  _count: { users: number };
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissionIds: [] as number[],
  });

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/roles`);
      const data = await res.json();
      if (data.success) {
        setRoles(data.data.roles);
        setPermissions(data.data.permissions);
      }
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors du chargement des rôles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const openAddModal = () => {
    setEditingRole(null);
    setFormData({ name: '', description: '', permissionIds: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (r: Role) => {
    setEditingRole(r);
    setFormData({ 
      name: r.name, 
      description: r.description || '', 
      permissionIds: r.permissions.map(p => p.id)
    });
    setIsModalOpen(true);
  };

  const togglePermission = (id: number) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(id) 
        ? prev.permissionIds.filter(pId => pId !== id)
        : [...prev.permissionIds, id]
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Le nom du rôle est obligatoire");
      return;
    }

    setSaving(true);
    try {
      const isEdit = !!editingRole;
      const url = isEdit ? `/api/admin/roles/${editingRole.id}` : `/api/admin/roles`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Rôle ${isEdit ? 'modifié' : 'créé'} avec succès`);
        setIsModalOpen(false);
        fetchRoles();
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
    if (!editingRole) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/roles/${editingRole.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Rôle supprimé avec succès');
        setIsDeleteOpen(false);
        setDeleteConfirmText('');
        fetchRoles();
      } else {
        toast.error(data.message || 'Erreur lors de la suppression');
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
          <h1 className="text-2xl font-bold text-foreground">Rôles & Permissions</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez les niveaux d'accès et les autorisations du système RBAC
          </p>
        </div>
        <Button onClick={openAddModal} className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
          <Plus className="h-4 w-4" />
          Créer un rôle
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-lips-gold border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            </div>
          ) : roles.length === 0 ? (
            <Card className="border-dashed border-2 bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <ShieldAlert className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-bold">Aucun rôle configuré</h3>
                <p className="text-muted-foreground text-sm mt-1 mb-4">Créez votre premier rôle pour commencer à gérer les accès.</p>
                <Button variant="outline" onClick={openAddModal}>Créer le premier rôle</Button>
              </CardContent>
            </Card>
          ) : (
            roles.map((role) => (
              <Card key={role.id} className="border-border/50 hover:border-lips-gold/50 transition-colors">
                <CardHeader className="pb-3 border-b border-border/50 bg-muted/10">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg border border-border/50">
                        <Shield className="h-5 w-5 text-lips-gold" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold">{role.name}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">{role.description || 'Aucune description'}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="gap-1.5 font-bold">
                      <Users className="h-3.5 w-3.5" />
                      {role._count.users} Utilisateurs
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="mb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Permissions Accordées ({role.permissions.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.length === 0 ? (
                      <span className="text-sm text-muted-foreground italic">Aucune permission spécifique</span>
                    ) : (
                      role.permissions.map(p => (
                        <Badge key={p.id} variant="outline" className="bg-background text-xs font-mono">
                          {p.action}
                        </Badge>
                      ))
                    )}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(role)} className="text-lips-green hover:text-lips-green-dark hover:bg-lips-green/10 gap-1.5">
                      <Pencil className="h-3.5 w-3.5" /> Modifier
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => { setEditingRole(role); setIsDeleteOpen(true); }} 
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10 gap-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Global Permissions List (Sidebar) */}
        <div className="space-y-4">
          <Card className="border-border/50 bg-muted/10">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-lips-emerald" />
                Registre des Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loading ? (
                  <div className="h-20 animate-pulse bg-muted rounded-md" />
                ) : permissions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune permission enregistrée.</p>
                ) : (
                  permissions.map(p => (
                    <div key={p.id} className="p-3 bg-background border border-border/50 rounded-lg">
                      <div className="font-mono text-xs font-bold text-foreground">{p.action}</div>
                      <div className="text-xs text-muted-foreground mt-1">{p.description || 'Permission système'}</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Modifier le rôle' : 'Créer un nouveau rôle'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nom du Rôle</Label>
              <Input 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})} 
                placeholder="Ex: ADMIN_FINANCES"
                className="uppercase font-mono font-bold text-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Description (Optionnelle)</Label>
              <Textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="Décrivez brièvement les responsabilités de ce rôle..."
                className="resize-none"
              />
            </div>

            <div className="mt-4">
              <Label className="text-base mb-3 block">Assignation des Permissions</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                {permissions.map((p) => (
                  <div key={p.id} className="flex items-start space-x-3">
                    <Checkbox 
                      id={`perm-${p.id}`} 
                      checked={formData.permissionIds.includes(p.id)}
                      onCheckedChange={() => togglePermission(p.id)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label 
                        htmlFor={`perm-${p.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-mono"
                      >
                        {p.action}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {p.description || 'Accès système'}
                      </p>
                    </div>
                  </div>
                ))}
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

      {/* Delete Confirmation Modal (Strong Security) */}
      <AlertDialog open={isDeleteOpen} onOpenChange={(open) => { setIsDeleteOpen(open); if (!open) setDeleteConfirmText(''); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Sécurité renforcée : Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                Êtes-vous sûr de vouloir supprimer le rôle <strong className="text-foreground">{editingRole?.name}</strong> ?
                {editingRole && editingRole._count.users > 0 && (
                  <span className="block mt-2 text-red-500 font-bold">
                    ⚠️ ATTENTION : Ce rôle est actuellement assigné à {editingRole._count.users} utilisateur(s). L'API bloquera la suppression.
                  </span>
                )}
                Cette action est irréversible.
              </p>
              <div className="space-y-2 mt-4">
                <Label htmlFor="confirmTextRole" className="text-foreground font-semibold">
                  Veuillez retaper le nom du rôle <span className="font-mono text-red-500">{editingRole?.name}</span> pour confirmer :
                </Label>
                <Input 
                  id="confirmTextRole"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={editingRole?.name}
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
              disabled={saving || deleteConfirmText !== editingRole?.name} 
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

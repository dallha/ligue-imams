'use client';

import { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Edit,
  Trash2,
  CalendarDays,
  Star,
  Eye,
  EyeOff,
  Settings,
  MapPin,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────

type EventCategory = 'Assemblée' | 'Formation' | 'Colloque' | 'Conférence' | 'Conseil';

interface AgendaEvent {
  id: number;
  title: string;
  date: string;
  dateEnd: string;
  hijriDate: string;
  location: string;
  category: EventCategory;
  description: string;
  published: boolean;
}

interface IslamicHoliday {
  id: number;
  hijriMonth: number;
  hijriDay: number;
  nameFr: string;
  nameAr: string;
  dotType: 'dot' | 'star';
  visible: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────

const INITIAL_EVENTS: AgendaEvent[] = [
  {
    id: 1,
    title: 'Assemblée Générale LIPS',
    date: '2026-03-15',
    dateEnd: '',
    hijriDate: '',
    location: 'Dakar',
    category: 'Assemblée',
    description: 'Assemblée générale annuelle de la LIPS réunissant tous les délégués régionaux pour le bilan et les perspectives.',
    published: true,
  },
  {
    id: 2,
    title: 'Séminaire de Formation des Imams',
    date: '2026-04-20',
    dateEnd: '2026-04-22',
    hijriDate: '',
    location: 'Thiès',
    category: 'Formation',
    description: 'Formation intensive de trois jours sur les pratiques imamiques, la gestion communautaire et le leadership religieux.',
    published: true,
  },
  {
    id: 3,
    title: 'Colloque sur la Paix Sociale',
    date: '2026-05-10',
    dateEnd: '',
    hijriDate: '',
    location: 'Saint-Louis',
    category: 'Colloque',
    description: 'Colloque intercommunautaire sur le rôle des imams dans la promotion de la paix sociale et la cohésion nationale.',
    published: true,
  },
  {
    id: 4,
    title: 'Conférence Fiqh Malékite',
    date: '2026-06-05',
    dateEnd: '',
    hijriDate: '',
    location: 'Kaolack',
    category: 'Conférence',
    description: 'Conférence académique sur le rite malékite et son application dans le contexte sénégalais contemporain.',
    published: true,
  },
  {
    id: 5,
    title: "Journée de l'Imam",
    date: '2026-06-27',
    dateEnd: '',
    hijriDate: '1 Ramadan 1447',
    location: 'Dakar',
    category: 'Assemblée',
    description: "Journée spéciale dédiée aux imams du Sénégal, avec remise de prix et reconnaissance du dévouement.",
    published: true,
  },
  {
    id: 6,
    title: "Formation Da'awa",
    date: '2026-07-27',
    dateEnd: '',
    hijriDate: '15 Shawwal 1447',
    location: 'Touba',
    category: 'Formation',
    description: "Formation sur les méthodes de prédication et de da'awa adaptées au contexte sénégalais.",
    published: true,
  },
  {
    id: 7,
    title: 'Conseil National des Imams',
    date: '2026-12-20',
    dateEnd: '',
    hijriDate: '',
    location: 'Dakar',
    category: 'Conseil',
    description: 'Réunion du Conseil National des Imams pour les décisions stratégiques et les orientations de la LIPS.',
    published: true,
  },
];

const INITIAL_HOLIDAYS: IslamicHoliday[] = [
  { id: 1, hijriMonth: 1, hijriDay: 1, nameFr: 'Nouvel An Islamique', nameAr: 'رأس السنة الهجرية', dotType: 'dot', visible: true },
  { id: 2, hijriMonth: 3, hijriDay: 12, nameFr: 'Mawlid an-Nabawi', nameAr: 'المولد النبوي', dotType: 'dot', visible: true },
  { id: 3, hijriMonth: 7, hijriDay: 27, nameFr: "Al-Isra wal-Mi'raj", nameAr: 'الإسراء والمعراج', dotType: 'dot', visible: true },
  { id: 4, hijriMonth: 8, hijriDay: 15, nameFr: "Nuit du Destin (Sha'ban)", nameAr: 'ليلة البراءة', dotType: 'dot', visible: true },
  { id: 5, hijriMonth: 9, hijriDay: 1, nameFr: 'Début du Ramadan', nameAr: 'بداية رمضان', dotType: 'dot', visible: true },
  { id: 6, hijriMonth: 9, hijriDay: 27, nameFr: 'Nuit du Destin (Ramadan)', nameAr: 'ليلة القدر', dotType: 'dot', visible: true },
  { id: 7, hijriMonth: 10, hijriDay: 1, nameFr: 'Aïd al-Fitr', nameAr: 'عيد الفطر', dotType: 'star', visible: true },
  { id: 8, hijriMonth: 12, hijriDay: 10, nameFr: 'Aïd al-Adha', nameAr: 'عيد الأضحى', dotType: 'star', visible: true },
];

const CATEGORY_OPTIONS: EventCategory[] = ['Assemblée', 'Formation', 'Colloque', 'Conférence', 'Conseil'];

const HIJRI_MONTHS = [
  'Muharram', 'Safar', "Rabi\u02BF al-Awwal", "Rabi\u02BF al-Thani",
  'Jumada al-Ula', 'Jumada al-Thania', 'Rajab', "Sha\u02BFban",
  'Ramadan', 'Shawwal', "Dhu al-Qi\u02BFdah", 'Dhu al-Hijjah',
];

const CATEGORY_COLORS: Record<EventCategory, string> = {
  Assemblée: 'bg-lips-green/10 text-lips-green',
  Formation: 'bg-lips-emerald/10 text-lips-emerald',
  Colloque: 'bg-blue-50 text-blue-700',
  Conférence: 'bg-lips-gold/10 text-lips-gold',
  Conseil: 'bg-purple-50 text-purple-700',
};

const emptyForm = {
  title: '',
  date: '',
  dateEnd: '',
  hijriDate: '',
  location: '',
  category: 'Assemblée' as EventCategory,
  description: '',
  published: true,
};

export default function AdminAgendaPage() {
  const [events, setEvents] = useState<AgendaEvent[]>(INITIAL_EVENTS);
  const [holidays, setHolidays] = useState<IslamicHoliday[]>(INITIAL_HOLIDAYS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calendar settings
  const [defaultCity, setDefaultCity] = useState('Dakar');
  const [showHijriCalendar, setShowHijriCalendar] = useState(true);
  const [showGregorianCalendar, setShowGregorianCalendar] = useState(true);
  const [showIslamicEvents, setShowIslamicEvents] = useState(true);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setDialogOpen(true);
  }

  function openEdit(item: AgendaEvent) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      date: item.date,
      dateEnd: item.dateEnd,
      hijriDate: item.hijriDate,
      location: item.location,
      category: item.category,
      description: item.description,
      published: item.published,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.title || !form.date || !form.location) {
      toast.error('Titre, date et lieu sont requis');
      return;
    }
    setSaving(true);
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 500));

      if (editingId) {
        setEvents((prev) =>
          prev.map((e) => (e.id === editingId ? { ...e, ...form } : e))
        );
        toast.success('Événement mis à jour');
      } else {
        const newEvent: AgendaEvent = {
          id: Math.max(...events.map((e) => e.id), 0) + 1,
          ...form,
        };
        setEvents((prev) => [...prev, newEvent]);
        toast.success('Événement créé');
      }

      setDialogOpen(false);
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setEvents((prev) => prev.filter((e) => e.id !== deleteId));
      toast.success('Événement supprimé');
      setDeleteId(null);
    } catch {
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  }

  function toggleEventPublish(item: AgendaEvent) {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === item.id ? { ...e, published: !e.published } : e
      )
    );
    toast.success(item.published ? 'Événement dépublié' : 'Événement publié');
  }

  function toggleHolidayVisibility(item: IslamicHoliday) {
    setHolidays((prev) =>
      prev.map((h) =>
        h.id === item.id ? { ...h, visible: !h.visible } : h
      )
    );
    toast.success(item.visible ? 'Date masquée' : 'Date affichée');
  }

  function formatDateFR(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-lips-green-dark">Gestion de l&apos;Agenda</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez les événements LIPS, les dates islamiques et le calendrier
          </p>
        </div>
      </div>

      {/* Tabs — only render Radix Tabs after mount to prevent hydration mismatch */}
      {!mounted ? (
        <div className="text-center py-8 text-muted-foreground">Chargement...</div>
      ) : (
      <Tabs defaultValue="evenements" className="w-full">
        <TabsList className="bg-white border border-border/50 shadow-sm">
          <TabsTrigger
            value="evenements"
            className="data-[state=active]:bg-lips-green data-[state=active]:text-white"
          >
            Événements
          </TabsTrigger>
          <TabsTrigger
            value="islamiques"
            className="data-[state=active]:bg-lips-green data-[state=active]:text-white"
          >
            Dates Islamiques
          </TabsTrigger>
          <TabsTrigger
            value="parametres"
            className="data-[state=active]:bg-lips-green data-[state=active]:text-white"
          >
            Paramètres Calendrier
          </TabsTrigger>
        </TabsList>

        {/* ─── Events Tab ─────────────────────────────────────── */}
        <TabsContent value="evenements" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="p-4 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-lips-green" />
                  <h3 className="font-semibold text-lips-green-dark">Événements LIPS</h3>
                  <Badge variant="secondary" className="text-xs">
                    {events.length}
                  </Badge>
                </div>
                <Button onClick={openCreate} className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter un événement
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="hidden md:table-cell">Lieu</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.length === 0 ? (
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
                        <TableRow key={item.id} className="hover:bg-gray-50/50">
                          <TableCell className="font-medium text-sm max-w-xs">
                            <p className="line-clamp-1">{item.title}</p>
                            {item.hijriDate && (
                              <span className="font-arabic text-xs text-lips-gold">{item.hijriDate}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            <div>{formatDateFR(item.date)}</div>
                            {item.dateEnd && (
                              <div className="text-xs text-muted-foreground">
                                au {formatDateFR(item.dateEnd)}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {item.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${CATEGORY_COLORS[item.category]}`}>
                              {item.category}
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
                                onClick={() => toggleEventPublish(item)}
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
        </TabsContent>

        {/* ─── Islamic Holidays Tab ───────────────────────────── */}
        <TabsContent value="islamiques" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="p-4 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-lips-gold" />
                  <h3 className="font-semibold text-lips-green-dark">Dates Islamiques</h3>
                  <Badge variant="secondary" className="text-xs">
                    {holidays.length}
                  </Badge>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Type</TableHead>
                      <TableHead>Nom (FR)</TableHead>
                      <TableHead>Nom (AR)</TableHead>
                      <TableHead>Date Hijri</TableHead>
                      <TableHead>Visible</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holidays.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50/50">
                        <TableCell>
                          {item.dotType === 'star' ? (
                            <Star className="h-4 w-4 text-lips-gold fill-current" />
                          ) : (
                            <span className="h-3 w-3 rounded-full bg-lips-green block" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-sm">{item.nameFr}</TableCell>
                        <TableCell>
                          <span className="font-arabic text-sm text-lips-gold">{item.nameAr}</span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.hijriDay} {HIJRI_MONTHS[item.hijriMonth - 1]}
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.visible ? 'default' : 'secondary'} className="text-xs">
                            {item.visible ? 'Affiché' : 'Masqué'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleHolidayVisibility(item)}
                              title={item.visible ? 'Masquer' : 'Afficher'}
                            >
                              {item.visible ? (
                                <Eye className="h-4 w-4 text-lips-green" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Settings Tab ───────────────────────────────────── */}
        <TabsContent value="parametres" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="h-5 w-5 text-lips-green" />
                <h3 className="font-semibold text-lips-green-dark">Paramètres du Calendrier</h3>
              </div>

              <div className="space-y-6 max-w-lg">
                {/* Default city */}
                <div className="space-y-2">
                  <Label>Ville par défaut</Label>
                  <Select value={defaultCity} onValueChange={setDefaultCity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dakar">Dakar</SelectItem>
                      <SelectItem value="Saint-Louis">Saint-Louis</SelectItem>
                      <SelectItem value="Thiès">Thiès</SelectItem>
                      <SelectItem value="Kaolack">Kaolack</SelectItem>
                      <SelectItem value="Touba">Touba</SelectItem>
                      <SelectItem value="Ziguinchor">Ziguinchor</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Ville utilisée pour le calcul des horaires de prière associés au calendrier.
                  </p>
                </div>

                {/* Display options */}
                <div className="space-y-4">
                  <Label className="text-base">Affichage du calendrier</Label>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">Calendrier Grégorien</p>
                      <p className="text-xs text-muted-foreground">Afficher le calendrier grégorien standard</p>
                    </div>
                    <Switch
                      checked={showGregorianCalendar}
                      onCheckedChange={setShowGregorianCalendar}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">Calendrier Hijri</p>
                      <p className="text-xs text-muted-foreground">Afficher le calendrier hégirien en parallèle</p>
                    </div>
                    <Switch
                      checked={showHijriCalendar}
                      onCheckedChange={setShowHijriCalendar}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">Événements islamiques</p>
                      <p className="text-xs text-muted-foreground">Afficher les dates islamiques sur le calendrier</p>
                    </div>
                    <Switch
                      checked={showIslamicEvents}
                      onCheckedChange={setShowIslamicEvents}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    className="bg-lips-green hover:bg-lips-green-dark text-white"
                    onClick={() => toast.success('Paramètres sauvegardés')}
                  >
                    Sauvegarder les paramètres
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Modifier l\'événement' : 'Nouvel événement'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Modifiez les informations de l\'événement' : 'Ajoutez un nouvel événement LIPS'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Titre *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Titre de l'événement"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de début *</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Input
                  type="date"
                  value={form.dateEnd}
                  onChange={(e) => setForm({ ...form, dateEnd: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date Hijri (optionnel)</Label>
              <Input
                value={form.hijriDate}
                onChange={(e) => setForm({ ...form, hijriDate: e.target.value })}
                placeholder="ex: 1 Ramadan 1447"
              />
              <p className="text-xs text-muted-foreground">
                Si renseignée, cette date sera affichée en plus de la date grégorienne.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lieu *</Label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Ville"
                />
              </div>
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v as EventCategory })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

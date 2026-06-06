'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  BookOpen,
  Headphones,
  Mic,
  Eye,
  EyeOff,
} from 'lucide-react';

// --- Mock Data ---

interface ReciterItem {
  id: number;
  name: string;
  bio: string;
  published: boolean;
  order: number;
}

const MOCK_RECITERS: ReciterItem[] = [
  { id: 1, name: 'Cheikh Ahmad Tijani Cissé', bio: 'Éminent récitateur tijani, spécialiste de la lecture de Warsh.', published: true, order: 1 },
  { id: 2, name: 'Imam Ratib Cissé', bio: 'Imam et récitateur renommé de Dakar.', published: true, order: 2 },
  { id: 3, name: 'Cheikh Moustapha Cissé', bio: 'Récitateur et enseignant de tajwid.', published: true, order: 3 },
  { id: 4, name: 'Abdou Karim Diop', bio: 'Récitateur de la communauté mouride, spécialiste des qira\'at.', published: true, order: 4 },
  { id: 5, name: 'Mouhammadou Bâ', bio: 'Récitateur et imam de la région de Saint-Louis.', published: false, order: 5 },
  { id: 6, name: 'Serigne Moustapha Sy', bio: 'Récitateur tidiane, voix respectée pour la psalmodie.', published: true, order: 6 },
];

interface VerseItem {
  id: number;
  arabic: string;
  french: string;
  reference: string;
  published: boolean;
  dateActive: string;
}

const MOCK_VERSES: VerseItem[] = [
  { id: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', french: 'Au nom d\'Allah, le Tout-Miséricordieux, le Très-Miséricordieux.', reference: 'Coran 1:1', published: true, dateActive: '2026-01-01' },
  { id: 2, arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', french: 'Allah ! Point de divinité à part Lui, le Vivant.', reference: 'Coran 2:255', published: true, dateActive: '2026-01-02' },
  { id: 3, arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا', french: 'Et quiconque craint Allah, Il lui donnera une issue.', reference: 'Coran 65:2', published: true, dateActive: '2026-01-03' },
  { id: 4, arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', french: 'Certes, avec la difficulté vient la facilité.', reference: 'Coran 94:6', published: true, dateActive: '2026-01-04' },
  { id: 5, arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', french: 'Et dis : « Ô mon Seigneur, augmente mes connaissances. »', reference: 'Coran 20:114', published: false, dateActive: '2026-01-05' },
];

interface ResourceItem {
  id: number;
  title: string;
  description: string;
  url: string;
  icon: string;
  published: boolean;
}

const MOCK_RESOURCES: ResourceItem[] = [
  { id: 1, title: 'Lecture du Coran', description: 'Lisez le Coran en ligne avec traduction française.', url: 'https://quran.com/fr/', icon: 'BookOpen', published: true },
  { id: 2, title: 'Coran en Wolof', description: 'Traduction du Coran en wolof.', url: '#', icon: 'Globe', published: true },
  { id: 3, title: 'Coran audio complet', description: 'Récitation intégrale du Saint Coran.', url: '#', icon: 'Headphones', published: true },
  { id: 4, title: 'Tafsir en français', description: 'Commentaire et exégèse du Coran en français.', url: '#', icon: 'Mic', published: true },
  { id: 5, title: 'Mémorisation (Hifz)', description: 'Guide pratique pour la mémorisation du Coran.', url: '#', icon: 'GraduationCap', published: false },
];

function getIconByName(name: string) {
  switch (name) {
    case 'BookOpen': return BookOpen;
    case 'Headphones': return Headphones;
    case 'Mic': return Mic;
    default: return BookOpen;
  }
}

export default function AdminCoranPage() {
  const [reciters] = useState<ReciterItem[]>(MOCK_RECITERS);
  const [verses] = useState<VerseItem[]>(MOCK_VERSES);
  const [resources] = useState<ResourceItem[]>(MOCK_RESOURCES);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-lips-green-dark">Gestion du Coran</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez les récitateurs, les versets du jour et les ressources coraniques
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="recitateurs" className="w-full">
        <TabsList className="bg-white border border-border/50 shadow-sm">
          <TabsTrigger
            value="recitateurs"
            className="data-[state=active]:bg-lips-green data-[state=active]:text-white"
          >
            Récitateurs
          </TabsTrigger>
          <TabsTrigger
            value="versets"
            className="data-[state=active]:bg-lips-green data-[state=active]:text-white"
          >
            Versets du Jour
          </TabsTrigger>
          <TabsTrigger
            value="ressources"
            className="data-[state=active]:bg-lips-green data-[state=active]:text-white"
          >
            Ressources
          </TabsTrigger>
        </TabsList>

        {/* Reciters Tab */}
        <TabsContent value="recitateurs" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="p-4 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-lips-green" />
                  <h3 className="font-semibold text-lips-green-dark">Récitateurs</h3>
                  <Badge variant="secondary" className="text-xs">
                    {reciters.length}
                  </Badge>
                </div>
                <Button className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter un récitatateur
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Ordre</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead className="hidden md:table-cell">Biographie</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reciters.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50/50">
                        <TableCell className="font-mono text-center">{item.order}</TableCell>
                        <TableCell className="font-medium text-sm">{item.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs hidden md:table-cell">
                          <p className="line-clamp-2">{item.bio}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.published ? 'default' : 'secondary'} className="text-xs">
                            {item.published ? 'Publié' : 'Brouillon'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" title={item.published ? 'Dépublier' : 'Publier'}>
                              {item.published ? (
                                <Eye className="h-4 w-4 text-lips-green" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
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

        {/* Verses Tab */}
        <TabsContent value="versets" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="p-4 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-lips-gold" />
                  <h3 className="font-semibold text-lips-green-dark">Versets du Jour</h3>
                  <Badge variant="secondary" className="text-xs">
                    {verses.length}
                  </Badge>
                </div>
                <Button className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter un verset
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">ID</TableHead>
                      <TableHead>Texte Arabe</TableHead>
                      <TableHead className="hidden lg:table-cell">Traduction Française</TableHead>
                      <TableHead>Référence</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verses.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50/50">
                        <TableCell className="font-mono text-center">{item.id}</TableCell>
                        <TableCell>
                          <p className="font-arabic text-sm text-right leading-relaxed max-w-xs" dir="rtl">
                            {item.arabic}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-sm hidden lg:table-cell">
                          <p className="line-clamp-2">{item.french}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs font-mono border-lips-gold/30 text-lips-gold">
                            {item.reference}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.published ? 'default' : 'secondary'} className="text-xs">
                            {item.published ? 'Publié' : 'Brouillon'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" title={item.published ? 'Dépublier' : 'Publier'}>
                              {item.published ? (
                                <Eye className="h-4 w-4 text-lips-green" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
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

        {/* Resources Tab */}
        <TabsContent value="ressources" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="p-4 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-lips-emerald" />
                  <h3 className="font-semibold text-lips-green-dark">Ressources Coraniques</h3>
                  <Badge variant="secondary" className="text-xs">
                    {resources.length}
                  </Badge>
                </div>
                <Button className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter une ressource
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">ID</TableHead>
                      <TableHead>Titre</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="hidden sm:table-cell">URL</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.map((item) => {
                      const IconComp = getIconByName(item.icon);
                      return (
                        <TableRow key={item.id} className="hover:bg-gray-50/50">
                          <TableCell className="font-mono text-center">{item.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <IconComp className="h-4 w-4 text-lips-green shrink-0" />
                              <span className="font-medium text-sm">{item.title}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-xs hidden md:table-cell">
                            <p className="line-clamp-2">{item.description}</p>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground font-mono max-w-[120px] truncate hidden sm:table-cell">
                            {item.url}
                          </TableCell>
                          <TableCell>
                            <Badge variant={item.published ? 'default' : 'secondary'} className="text-xs">
                              {item.published ? 'Publié' : 'Brouillon'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" title={item.published ? 'Dépublier' : 'Publier'}>
                                {item.published ? (
                                  <Eye className="h-4 w-4 text-lips-green" />
                                ) : (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

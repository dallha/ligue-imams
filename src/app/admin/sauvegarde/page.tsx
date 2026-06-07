'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download,
  Upload,
  Database,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ShieldAlert,
  Info,
  FileDown,
  RefreshCw,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface ImportResult {
  [sheet: string]: {
    inserted: number
    errors: string[]
  }
}

const SHEETS_INFO = [
  { name: 'Membres', icon: '👥', desc: 'Tous les membres avec région et rôle' },
  { name: 'Régions', icon: '🗺️', desc: '14 régions avec population et coordonnées' },
  { name: 'Mosquées', icon: '🕌', desc: 'Liste des mosquées affiliées' },
  { name: 'Paiements', icon: '💰', desc: 'Historique des dons et cotisations' },
  { name: 'Contenus', icon: '📄', desc: 'Articles, fatwas, communiqués' },
  { name: 'Bureau', icon: '🏛️', desc: 'Membres du bureau exécutif' },
  { name: 'Commissions', icon: '⚖️', desc: 'Commissions permanentes' },
  { name: 'Événements', icon: '📅', desc: 'Agenda et événements' },
  { name: 'Concours', icon: '🏆', desc: 'Concours coraniques' },
  { name: 'FAQ', icon: '❓', desc: 'Questions fréquentes' },
  { name: 'Galerie', icon: '🖼️', desc: 'Albums galerie' },
  { name: 'Statistiques', icon: '📊', desc: 'Indicateurs clés' },
  { name: 'Paramètres', icon: '⚙️', desc: 'Configuration du site' },
]

const IMPORTABLE_SHEETS = ['Membres', 'Régions', 'Bureau', 'FAQ', 'Paramètres']

export default function SauvegardePage() {
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importResults, setImportResults] = useState<ImportResult | null>(null)
  const [expandedSheet, setExpandedSheet] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // ── Export ──────────────────────────────────────────────
  async function handleExport() {
    setExporting(true)
    try {
      const res = await fetch('/api/admin/backup/export')
      if (!res.ok) throw new Error()

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const date = new Date().toISOString().split('T')[0]
      const a = document.createElement('a')
      a.href = url
      a.download = `LIPS_Sauvegarde_${date}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Sauvegarde téléchargée avec succès !')
    } catch {
      toast.error('Erreur lors de l\'export')
    } finally {
      setExporting(false)
    }
  }

  // ── Import ──────────────────────────────────────────────
  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.xlsx')) {
      setSelectedFile(file)
      setImportResults(null)
    } else {
      toast.error('Veuillez déposer un fichier .xlsx valide')
    }
  }, [])

  async function handleImport() {
    if (!selectedFile) return
    setImporting(true)
    setImportResults(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const res = await fetch('/api/admin/backup/import', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setImportResults(data.results)
      const totalInserted = Object.values(data.results as ImportResult).reduce(
        (sum, r) => sum + r.inserted,
        0
      )
      toast.success(`Import terminé ! ${totalInserted} entrées importées.`)
    } catch (err) {
      toast.error(String(err) || 'Erreur lors de l\'import')
    } finally {
      setImporting(false)
    }
  }

  const totalErrors = importResults
    ? Object.values(importResults).reduce((sum, r) => sum + r.errors.length, 0)
    : 0
  const totalInserted = importResults
    ? Object.values(importResults).reduce((sum, r) => sum + r.inserted, 0)
    : 0

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="p-2 rounded-xl bg-lips-green/10">
            <Database className="h-6 w-6 text-lips-green" />
          </div>
          Sauvegarde & Import
        </h1>
        <p className="text-muted-foreground text-sm mt-2">
          Exportez toute la base de données en fichier Excel ou importez des données depuis un fichier Excel.
        </p>
      </div>

      {/* Export Section */}
      <Card className="border-lips-green/20 shadow-md overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-lips-green to-lips-emerald" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-lips-green/10">
                <FileDown className="h-5 w-5 text-lips-green" />
              </div>
              <div>
                <CardTitle className="text-lg">Exporter la Base de Données</CardTitle>
                <CardDescription>
                  Télécharger un fichier Excel complet avec toutes les données
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={handleExport}
              disabled={exporting}
              className="bg-lips-green hover:bg-lips-green-dark text-white gap-2 min-w-[160px]"
            >
              {exporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Export en cours…
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Télécharger Excel
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Sheets preview */}
          <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
              Contenu du fichier ({SHEETS_INFO.length} feuilles)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {SHEETS_INFO.map((sheet) => (
                <div
                  key={sheet.name}
                  className="flex items-start gap-3 bg-background rounded-lg p-3 border border-border/50"
                >
                  <span className="text-xl leading-none mt-0.5">{sheet.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                      {sheet.name}
                      {IMPORTABLE_SHEETS.includes(sheet.name) && (
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 text-lips-green border-lips-green/30">
                          importable
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{sheet.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card className="border-orange-200/50 shadow-md overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-orange-400 to-amber-400" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10">
              <Upload className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Importer des Données</CardTitle>
              <CardDescription>
                Charger un fichier Excel pour mettre à jour la base de données
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Warning */}
          <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4">
            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Feuilles importables : {IMPORTABLE_SHEETS.join(', ')}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                Les données existantes seront mises à jour (upsert) selon les clés uniques.
                Les feuilles Paiements, Mosquées, Contenus, etc. sont en lecture seule à l'import.
              </p>
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDrop={handleFileDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
              ${dragOver
                ? 'border-lips-green bg-lips-green/5 scale-[1.01]'
                : selectedFile
                  ? 'border-lips-green/40 bg-lips-green/5'
                  : 'border-border hover:border-lips-green/40 hover:bg-muted/30'
              }
            `}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) { setSelectedFile(f); setImportResults(null) }
              }}
            />
            <AnimatePresence mode="wait">
              {selectedFile ? (
                <motion.div
                  key="file"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-lips-green/10 flex items-center justify-center">
                    <FileSpreadsheet className="h-8 w-8 text-lips-green" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} Ko — Cliquer pour changer
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Glisser-déposer un fichier .xlsx</p>
                    <p className="text-sm text-muted-foreground">ou cliquer pour sélectionner</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Import Button */}
          {selectedFile && (
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSelectedFile(null); setImportResults(null) }}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Changer de fichier
              </Button>
              <Button
                onClick={handleImport}
                disabled={importing}
                className="bg-orange-500 hover:bg-orange-600 text-white gap-2 min-w-[160px]"
              >
                {importing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Import en cours…
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Lancer l'Import
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Import Results */}
          <AnimatePresence>
            {importResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                    <div>
                      <div className="text-2xl font-black text-green-700 dark:text-green-400">{totalInserted}</div>
                      <div className="text-xs text-green-600 font-medium">Entrées importées</div>
                    </div>
                  </div>
                  <div className={`border rounded-xl p-4 flex items-center gap-3 ${
                    totalErrors > 0
                      ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'
                      : 'bg-muted/30 border-border/50'
                  }`}>
                    <AlertTriangle className={`h-6 w-6 shrink-0 ${totalErrors > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
                    <div>
                      <div className={`text-2xl font-black ${totalErrors > 0 ? 'text-red-600' : 'text-foreground'}`}>{totalErrors}</div>
                      <div className="text-xs text-muted-foreground font-medium">Erreurs</div>
                    </div>
                  </div>
                </div>

                {/* Per-sheet details */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Info className="h-3 w-3" />
                    Détail par feuille
                  </p>
                  {Object.entries(importResults).map(([sheet, result]) => (
                    <div key={sheet} className="bg-muted/30 rounded-xl border border-border/50 overflow-hidden">
                      <button
                        onClick={() => setExpandedSheet(expandedSheet === sheet ? null : sheet)}
                        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-sm">{sheet}</span>
                          <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                            +{result.inserted}
                          </Badge>
                          {result.errors.length > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {result.errors.length} erreur(s)
                            </Badge>
                          )}
                        </div>
                        {result.errors.length > 0 && (
                          expandedSheet === sheet
                            ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedSheet === sheet && result.errors.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-1">
                              {result.errors.map((err, i) => (
                                <div key={i} className="text-xs text-red-600 bg-red-50 dark:bg-red-500/10 p-2 rounded-lg font-mono">
                                  {err}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}

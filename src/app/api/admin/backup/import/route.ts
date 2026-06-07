import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'
import * as XLSX from 'xlsx'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const wb = XLSX.read(buffer, { type: 'buffer' })

    const results: Record<string, { inserted: number; errors: string[] }> = {}

    // ── Membres ───────────────────────────────────────────
    if (wb.SheetNames.includes('Membres')) {
      const ws = wb.Sheets['Membres']
      const rows = XLSX.utils.sheet_to_json(ws) as Record<string, string>[]
      let inserted = 0
      const errors: string[] = []

      for (const row of rows) {
        try {
          const matricule = row['Matricule']
          const email = row['Email']
          if (!matricule || !email) continue

          // Find region by name
          const regionNom = row['Région']
          const region = regionNom
            ? await db.region.findFirst({ where: { nom: regionNom } })
            : null

          if (!region) {
            errors.push(`Région introuvable pour ${matricule}: "${regionNom}"`)
            continue
          }

          await db.user.upsert({
            where: { matricule },
            update: {
              nom: row['Nom'] || '',
              prenom: row['Prénom'] || '',
              telephone: row['Téléphone'] || '',
              status: row['Statut'] || 'EN_ATTENTE',
              regionId: region.id,
            },
            create: {
              matricule,
              email,
              password: 'IMPORTED_CHANGE_ME',
              nom: row['Nom'] || '',
              prenom: row['Prénom'] || '',
              telephone: row['Téléphone'] || '',
              status: row['Statut'] || 'EN_ATTENTE',
              regionId: region.id,
            },
          })
          inserted++
        } catch (e) {
          errors.push(`Erreur ligne ${JSON.stringify(row)}: ${e}`)
        }
      }
      results['Membres'] = { inserted, errors }
    }

    // ── Régions ───────────────────────────────────────────
    if (wb.SheetNames.includes('Régions')) {
      const ws = wb.Sheets['Régions']
      const rows = XLSX.utils.sheet_to_json(ws) as Record<string, string | number>[]
      let inserted = 0
      const errors: string[] = []

      for (const row of rows) {
        try {
          const code = String(row['Code'] || '').trim()
          if (!code) continue

          await db.region.upsert({
            where: { code },
            update: {
              nom: String(row['Nom'] || ''),
              nomAr: String(row['Nom (Arabe)'] || '') || null,
              population: Number(row['Population']) || null,
              mosqueCount: Number(row['Mosquées']) || null,
              latitude: row['Latitude'] ? Number(row['Latitude']) : null,
              longitude: row['Longitude'] ? Number(row['Longitude']) : null,
            },
            create: {
              code,
              nom: String(row['Nom'] || ''),
              nomAr: String(row['Nom (Arabe)'] || '') || null,
              population: Number(row['Population']) || null,
              mosqueCount: Number(row['Mosquées']) || null,
              latitude: row['Latitude'] ? Number(row['Latitude']) : null,
              longitude: row['Longitude'] ? Number(row['Longitude']) : null,
            },
          })
          inserted++
        } catch (e) {
          errors.push(`Erreur ligne: ${e}`)
        }
      }
      results['Régions'] = { inserted, errors }
    }

    // ── Bureau ────────────────────────────────────────────
    if (wb.SheetNames.includes('Bureau')) {
      const ws = wb.Sheets['Bureau']
      const rows = XLSX.utils.sheet_to_json(ws) as Record<string, string | number>[]
      let inserted = 0
      const errors: string[] = []

      for (const row of rows) {
        try {
          const nom = String(row['Nom'] || '').trim()
          const prenom = String(row['Prénom'] || '').trim()
          const role = String(row['Rôle'] || '').trim()
          if (!nom || !role) continue

          await db.bureauMember.create({
            data: {
              nom,
              prenom,
              role,
              roleAr: String(row['Rôle (Arabe)'] || '') || null,
              region: String(row['Région'] || '') || null,
              bio: String(row['Bio'] || '') || null,
              published: String(row['Publié']) === 'Oui',
              ordre: Number(row['Ordre']) || 0,
            },
          })
          inserted++
        } catch (e) {
          errors.push(`Erreur ligne: ${e}`)
        }
      }
      results['Bureau'] = { inserted, errors }
    }

    // ── FAQ ───────────────────────────────────────────────
    if (wb.SheetNames.includes('FAQ')) {
      const ws = wb.Sheets['FAQ']
      const rows = XLSX.utils.sheet_to_json(ws) as Record<string, string | number>[]
      let inserted = 0
      const errors: string[] = []

      for (const row of rows) {
        try {
          const question = String(row['Question'] || '').trim()
          if (!question) continue

          await db.fAQ.create({
            data: {
              question,
              reponse: String(row['Réponse'] || ''),
              ordre: Number(row['Ordre']) || 0,
              published: String(row['Publié']) === 'Oui',
            },
          })
          inserted++
        } catch (e) {
          errors.push(`Erreur ligne: ${e}`)
        }
      }
      results['FAQ'] = { inserted, errors }
    }

    // ── Paramètres ────────────────────────────────────────
    if (wb.SheetNames.includes('Paramètres')) {
      const ws = wb.Sheets['Paramètres']
      const rows = XLSX.utils.sheet_to_json(ws) as Record<string, string>[]
      let inserted = 0
      const errors: string[] = []

      for (const row of rows) {
        try {
          const key = String(row['Clé'] || '').trim()
          const value = String(row['Valeur'] || '').trim()
          if (!key) continue

          await db.siteConfig.upsert({
            where: { key },
            update: { value },
            create: { key, value },
          })
          inserted++
        } catch (e) {
          errors.push(`Erreur ligne: ${e}`)
        }
      }
      results['Paramètres'] = { inserted, errors }
    }

    return NextResponse.json({
      success: true,
      message: 'Import terminé avec succès',
      results,
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'import' }, { status: 500 })
  }
}

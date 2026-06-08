import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import * as XLSX from 'xlsx'

export async function GET() {
  try {
    // Fetch all data from the database
    const [
      members,
      regions,
      mosques,
      paiements,
      contenus,
      bureau,
      commissions,
      concours,
      faq,
      events,
      galerie,
      statistiques,
      siteConfig,
    ] = await Promise.all([
      db.user.findMany({
        include: { region: true, mosque: true },
        orderBy: { createdAt: 'desc' },
      }),
      db.region.findMany({ orderBy: { nom: 'asc' } }),
      db.mosque.findMany({ include: { region: true }, orderBy: { nom: 'asc' } }),
      db.paiement.findMany({
        include: { user: { select: { nom: true, prenom: true, matricule: true } } },
        orderBy: { datePaiement: 'desc' },
      }),
      db.content.findMany({ orderBy: { createdAt: 'desc' } }),
      db.bureauMember.findMany({ orderBy: { ordre: 'asc' } }),
      db.commission.findMany({ orderBy: { ordre: 'asc' } }),
      db.concours.findMany({ orderBy: { dateDebut: 'desc' } }),
      db.fAQ.findMany({ orderBy: { ordre: 'asc' } }),
      db.event.findMany({ orderBy: { dateDebut: 'desc' } }),
      db.galerie.findMany({ orderBy: { createdAt: 'desc' } }),
      db.statistique.findMany({ orderBy: { ordre: 'asc' } }),
      db.siteConfig.findMany({ orderBy: { key: 'asc' } }),
    ])

    const wb = XLSX.utils.book_new()

    // ── Sheet 1: Membres ─────────────────────────────────
    const membresRows = members.map((m) => ({
      'Matricule': m.matricule,
      'Prénom': m.prenom,
      'Nom': m.nom,
      'Email': m.email,
      'Téléphone': m.telephone,
      'Statut': m.status,
      'Région': m.region?.nom || '',
      'Mosquée': m.mosque?.nom || '',
      'Date Création': new Date(m.createdAt).toLocaleDateString('fr-FR'),
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(membresRows), 'Membres')

    // ── Sheet 2: Régions ──────────────────────────────────
    const regionsRows = regions.map((r) => ({
      'Code': r.code,
      'Nom': r.nom,
      'Nom (Arabe)': r.nomAr || '',
      'Population': r.population || 0,
      'Mosquées': r.mosqueCount || 0,
      'Latitude': r.latitude || '',
      'Longitude': r.longitude || '',
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(regionsRows), 'Régions')

    // ── Sheet 3: Mosquées ─────────────────────────────────
    const mosquéesRows = mosques.map((m) => ({
      'ID': m.id,
      'Nom': m.nom,
      'Adresse': m.adresse,
      'Région': m.region.nom,
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(mosquéesRows), 'Mosquées')

    // ── Sheet 4: Paiements ────────────────────────────────
    const paiementsRows = paiements.map((p) => ({
      'Référence': p.referenceTrans,
      'Membre': `${p.user.prenom} ${p.user.nom}`,
      'Matricule': p.user.matricule,
      'Type': p.type,
      'Montant (FCFA)': p.montant,
      'Méthode': p.methode,
      'Date': new Date(p.datePaiement).toLocaleDateString('fr-FR'),
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(paiementsRows), 'Paiements')

    // ── Sheet 5: Contenus ─────────────────────────────────
    const contenusRows = contenus.map((c) => ({
      'ID': c.id,
      'Titre': c.titre,
      'Type': c.type,
      'Catégorie': c.categorie || '',
      'Publié': c.published ? 'Oui' : 'Non',
      'Date Création': new Date(c.createdAt).toLocaleDateString('fr-FR'),
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(contenusRows), 'Contenus')

    // ── Sheet 6: Bureau ───────────────────────────────────
    const bureauRows = bureau.map((b) => ({
      'Prénom': b.prenom,
      'Nom': b.nom,
      'Rôle': b.role,
      'Rôle (Arabe)': b.roleAr || '',
      'Région': b.region || '',
      'Bio': b.bio || '',
      'Publié': b.published ? 'Oui' : 'Non',
      'Ordre': b.ordre,
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(bureauRows), 'Bureau')

    // ── Sheet 7: Commissions ──────────────────────────────
    const commissionsRows = commissions.map((c) => ({
      'Nom': c.nom,
      'Nom (Arabe)': c.nomAr || '',
      'Description': c.desc || '',
      'Membres': c.members,
      'Publié': c.published ? 'Oui' : 'Non',
      'Ordre': c.ordre,
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(commissionsRows), 'Commissions')

    // ── Sheet 8: Événements ───────────────────────────────
    const eventsRows = events.map((e) => ({
      'Titre': e.titre,
      'Type': e.type,
      'Date Début': new Date(e.dateDebut).toLocaleDateString('fr-FR'),
      'Date Fin': e.dateFin ? new Date(e.dateFin).toLocaleDateString('fr-FR') : '',
      'Lieu': e.lieu || '',
      'Publié': e.published ? 'Oui' : 'Non',
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(eventsRows), 'Événements')

    // ── Sheet 9: Concours ──────────────────────────────────
    const concoursRows = concours.map((c) => ({
      'Nom': c.nom,
      'Type': c.type,
      'Statut': c.statut,
      'Date Début': new Date(c.dateDebut).toLocaleDateString('fr-FR'),
      'Lieu': c.lieu || '',
      'Participants Est.': c.participantsEst || 0,
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(concoursRows), 'Concours')

    // ── Sheet 10: FAQ ──────────────────────────────────────
    const faqRows = faq.map((f) => ({
      'Question': f.question,
      'Réponse': f.reponse,
      'Ordre': f.ordre,
      'Publié': f.published ? 'Oui' : 'Non',
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(faqRows), 'FAQ')

    // ── Sheet 11: Galerie ──────────────────────────────────
    const galerieRows = galerie.map((g) => ({
      'Titre': g.titre,
      'Lieu': g.lieu || '',
      'Date': g.date || '',
      'Nombre de photos': g.count,
      'Publié': g.published ? 'Oui' : 'Non',
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(galerieRows), 'Galerie')

    // ── Sheet 12: Statistiques ─────────────────────────────
    const statsRows = statistiques.map((s) => ({
      'Clé': s.key,
      'Label': s.label,
      'Valeur': s.value,
      'Suffixe': s.suffix || '',
      'Description': s.desc || '',
      'Publié': s.published ? 'Oui' : 'Non',
      'Ordre': s.ordre,
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(statsRows), 'Statistiques')

    // ── Sheet 13: Paramètres Site ──────────────────────────
    const configRows = siteConfig.map((c) => ({
      'Clé': c.key,
      'Valeur': c.value,
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(configRows), 'Paramètres')

    // Generate Excel buffer
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    const date = new Date().toISOString().split('T')[0]
    const filename = `LIPS_Sauvegarde_${date}.xlsx`

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': excelBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'export' }, { status: 500 })
  }
}

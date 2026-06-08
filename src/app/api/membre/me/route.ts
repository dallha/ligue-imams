import { NextResponse } from 'next/server'
import { getMemberSession } from '@/lib/member-auth'
import { db } from '@/lib/db'

// Demo member data for when DB has no matching user
const DEMO_MEMBER = {
  nom: 'Traoré',
  prenom: 'Amadou',
  email: 'amadou.traore@lips.sn',
  telephone: '+221 77 000 00 00',
  matricule: 'LIPS-0002',
  role: 'IMAM',
  status: 'ACTIF',
  region: { nom: 'Dakar', nomAr: 'دكار' },
  mosque: { nom: 'Mosquée An-Nour', adresse: 'Liberté II, Dakar' },
  carteMembre: {
    numeroCarte: 'LIPS-0002',
    dateEmission: '2025-01-15',
    dateExpiration: '2026-01-15',
  },
  paiements: [
    { id: 1, montant: 10000, type: 'COTISATION', methode: 'Wave', datePaiement: '2025-01-15', referenceTrans: 'WAV-2025-001' },
    { id: 2, montant: 50000, type: 'DON', methode: 'CinetPay', datePaiement: '2025-03-20', referenceTrans: 'CIN-2025-042' },
    { id: 3, montant: 10000, type: 'COTISATION', methode: 'Espèces', datePaiement: '2026-01-10', referenceTrans: 'ESP-2026-003' },
  ],
}

const DEMO_COMMUNICATIONS = [
  { id: 1, titre: 'Communiqué sur le début du Ramadan 2026', type: 'COMMUNIQUE', date: '2026-02-15' },
  { id: 2, titre: 'Fatwa sur la Zakat Al-Fitr', type: 'FATWA', date: '2026-03-01' },
  { id: 3, titre: 'Réunion régionale des Imams de Dakar', type: 'EVENEMENT', date: '2026-03-10' },
]

export async function GET() {
  try {
    const session = await getMemberSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Fetch user from DB with all relations
    const user = await db.user.findUnique({
      where: { id: session.id },
      include: {
        region: true,
        mosque: true,
        carteMembre: true,
        role: true,
        paiements: {
          orderBy: { datePaiement: 'desc' },
          take: 5,
        },
      },
    })

    if (!user) {
      // Return demo data if user not found in DB
      return NextResponse.json({
        user: {
          id: session.id,
          email: DEMO_MEMBER.email,
          nom: DEMO_MEMBER.nom,
          prenom: DEMO_MEMBER.prenom,
          role: DEMO_MEMBER.role,
          matricule: DEMO_MEMBER.matricule,
          status: DEMO_MEMBER.status,
          telephone: DEMO_MEMBER.telephone,
          photo: null,
          region: DEMO_MEMBER.region,
          mosque: DEMO_MEMBER.mosque,
          carteMembre: DEMO_MEMBER.carteMembre,
          paiements: DEMO_MEMBER.paiements,
          communications: DEMO_COMMUNICATIONS,
        },
      })
    }

    // Get recent communications (communiqués and fatwas)
    const communications = await db.content.findMany({
      where: {
        type: { in: ['COMMUNIQUE', 'FATWA'] },
        published: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        titre: true,
        type: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role?.name || '',
        matricule: user.matricule,
        status: user.status,
        telephone: user.telephone,
        photo: user.photo,
        region: user.region ? { nom: user.region.nom, nomAr: user.region.nomAr } : null,
        mosque: user.mosque ? { nom: user.mosque.nom, adresse: user.mosque.adresse } : null,
        carteMembre: user.carteMembre ? {
          numeroCarte: user.carteMembre.numeroCarte,
          dateEmission: user.carteMembre.dateEmission,
          dateExpiration: user.carteMembre.dateExpiration,
        } : null,
        paiements: user.paiements.map(p => ({
          id: p.id,
          montant: p.montant,
          type: p.type,
          methode: p.methode,
          datePaiement: p.datePaiement,
          referenceTrans: p.referenceTrans,
        })),
        communications: communications.length > 0
          ? communications.map(c => ({
              id: c.id,
              titre: c.titre,
              type: c.type,
              date: c.createdAt,
            }))
          : DEMO_COMMUNICATIONS,
      },
    })
  } catch (error) {
    console.error('Get member session error:', error)
    // Fallback to demo data on error
    const session = await getMemberSession()
    if (session) {
      return NextResponse.json({
        user: {
          id: session.id,
          email: session.email,
          nom: session.nom,
          prenom: session.prenom,
          role: session.role,
          matricule: session.matricule,
          status: 'ACTIF',
          telephone: '+221 77 000 00 00',
          photo: null,
          region: { nom: 'Dakar', nomAr: 'دكار' },
          mosque: { nom: 'Mosquée An-Nour', adresse: 'Liberté II, Dakar' },
          carteMembre: {
            numeroCarte: session.matricule,
            dateEmission: '2025-01-15',
            dateExpiration: '2026-01-15',
          },
          paiements: DEMO_MEMBER.paiements,
          communications: DEMO_COMMUNICATIONS,
        },
      })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

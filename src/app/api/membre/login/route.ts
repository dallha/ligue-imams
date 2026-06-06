import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { compare } from 'bcryptjs'
import { createMemberSession, setMemberCookie } from '@/lib/member-auth'

const MEMBER_ROLES = ['IMAM', 'PREDICATEUR', 'RESPONSABLE_REGIONAL', 'MEMBRE_CHOURA']

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email/Matricule et mot de passe requis' },
        { status: 400 }
      )
    }

    // Find user by email or matricule
    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: email },
          { matricule: email },
        ],
      },
      include: { region: true, mosque: true, carteMembre: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      )
    }

    if (!MEMBER_ROLES.includes(user.role)) {
      return NextResponse.json(
        { error: 'Accès non autorisé. Cet espace est réservé aux membres.' },
        { status: 403 }
      )
    }

    const passwordValid = await compare(password, user.password)
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      )
    }

    const token = await createMemberSession({
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      matricule: user.matricule,
    })

    await setMemberCookie(token)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
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
      },
    })
  } catch (error) {
    console.error('Member login error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

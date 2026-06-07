import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getMemberSession } from '@/lib/member-auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getMemberSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Le header Idempotency-Key est requis pour éviter les doubles facturations
    const idempotencyKey = req.headers.get('Idempotency-Key');
    
    if (!idempotencyKey) {
      return NextResponse.json(
        { error: "L'en-tête Idempotency-Key est obligatoire." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { montant, type, methode } = body;

    if (!montant || !type || !methode) {
      return NextResponse.json(
        { error: 'Montant, type et méthode sont requis.' },
        { status: 400 }
      );
    }

    // Vérification de l'idempotence : ce paiement existe-t-il déjà ?
    // On utilise la referenceTrans comme clé d'idempotence
    const existingPayment = await db.paiement.findUnique({
      where: { referenceTrans: idempotencyKey },
    });

    if (existingPayment) {
      // Le paiement a déjà été traité, on renvoie un statut 200 (OK)
      // pour éviter qu'un retry du client ne cause une erreur.
      return NextResponse.json(
        { message: 'Paiement déjà traité (Idempotence)', paiement: existingPayment },
        { status: 200 }
      );
    }

    // Si le paiement n'existe pas, on le crée
    const newPayment = await db.paiement.create({
      data: {
        montant: Number(montant),
        type,
        methode,
        referenceTrans: idempotencyKey,
        userId: session.id,
      },
    });

    return NextResponse.json(
      { message: 'Paiement enregistré avec succès', paiement: newPayment },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur de paiement:', error);
    return NextResponse.json(
      { error: 'Erreur interne lors de la création du paiement' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { montant, type, methode } = body;

    const updatedPaiement = await prisma.paiement.update({
      where: { id },
      data: {
        montant: parseFloat(montant),
        type,
        methode,
      }
    });

    return NextResponse.json({ success: true, data: updatedPaiement });
  } catch (error) {
    console.error('Erreur MAJ Paiement:', error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    await prisma.paiement.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Paiement supprimé" });
  } catch (error) {
    console.error('Erreur Suppression Paiement:', error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

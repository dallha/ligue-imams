import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { key, icon, value, suffix, label, labelAr, desc, descAr, ordre, published } = body;

    const updated = await prisma.statistique.update({
      where: { id },
      data: {
        key,
        icon,
        value: value !== undefined ? parseInt(value) : undefined,
        suffix,
        label,
        labelAr,
        desc,
        descAr,
        ordre: ordre !== undefined ? parseInt(ordre) : undefined,
        published,
      },
    });

    return NextResponse.json({ data: updated, message: 'Statistique mise à jour avec succès' });
  } catch (error) {
    console.error('Error updating statistique:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    await prisma.statistique.delete({ where: { id } });
    return NextResponse.json({ message: 'Statistique supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting statistique:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}

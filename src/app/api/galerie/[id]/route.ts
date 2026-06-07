import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { titre, titreAr, lieu, date, count, imageUrl, published, gradient } = body;

    const updated = await prisma.galerie.update({
      where: { id },
      data: {
        titre,
        titreAr,
        lieu,
        date,
        count: count !== undefined ? parseInt(count) : undefined,
        imageUrl,
        published,
        gradient,
      },
    });

    return NextResponse.json({ data: updated, message: 'Album mis à jour avec succès' });
  } catch (error) {
    console.error('Error updating galerie:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    await prisma.galerie.delete({ where: { id } });
    return NextResponse.json({ message: 'Album supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting galerie:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}

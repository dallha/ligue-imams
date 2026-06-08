import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    const body = await request.json();
    const { titre, titreAr, lieu, date, count, imageUrl, published, gradient } = body;

    const updated = await prisma.galerie.update({
      where: { id },
      data: {
        ...(titre !== undefined && { titre }),
        ...(titreAr !== undefined && { titreAr: titreAr || null }),
        ...(lieu !== undefined && { lieu: lieu || null }),
        ...(date !== undefined && { date: date || null }),
        ...(count !== undefined && { count: Number(count) || 0 }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
        ...(published !== undefined && { published }),
        ...(gradient !== undefined && { gradient }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ data: updated, message: 'Album mis à jour avec succès' });
  } catch (error) {
    console.error('Error updating galerie:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    await prisma.galerie.delete({ where: { id } });
    return NextResponse.json({ message: 'Album supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting galerie:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}

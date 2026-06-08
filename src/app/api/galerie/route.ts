import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const galeries = await prisma.galerie.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ data: galeries });
  } catch (error) {
    console.error('Error fetching galeries:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titre, titreAr, lieu, date, count, imageUrl, published, gradient } = body;

    const newGalerie = await prisma.galerie.create({
      data: {
        titre,
        titreAr: titreAr || null,
        lieu: lieu || null,
        date: date || null,
        count: count !== undefined ? (Number(count) || 0) : 0,
        imageUrl: imageUrl || null,
        published: published ?? true,
        gradient: gradient || "from-lips-green-dark to-lips-green",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ data: newGalerie, message: 'Album créé avec succès' }, { status: 201 });
  } catch (error) {
    console.error('Error creating galerie:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const stats = await prisma.statistique.findMany({
      orderBy: { ordre: 'asc' },
    });
    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error('Error fetching statistiques:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, icon, value, suffix, label, labelAr, desc, descAr, ordre, published } = body;

    const newStat = await prisma.statistique.create({
      data: {
        key,
        icon,
        value: parseInt(value) || 0,
        suffix,
        label,
        labelAr,
        desc,
        descAr,
        ordre: parseInt(ordre) || 0,
        published: published ?? true,
      },
    });

    return NextResponse.json({ data: newStat, message: 'Statistique créée avec succès' }, { status: 201 });
  } catch (error) {
    console.error('Error creating statistique:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}

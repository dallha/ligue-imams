import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET() {
  try {
    const stats = await prisma.statistique.findMany({
      where: { published: true },
      orderBy: { ordre: 'asc' },
    });
    
    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error('Error fetching statistiques:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

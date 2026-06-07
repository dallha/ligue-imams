import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    
    let query: any = {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    };

    if (limit) {
      query.take = parseInt(limit);
    }

    const galeries = await prisma.galerie.findMany(query);
    
    return NextResponse.json({ data: galeries });
  } catch (error) {
    console.error('Error fetching galeries:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keysParam = searchParams.get('keys');

    if (!keysParam) {
      return NextResponse.json({ success: false, message: 'No keys provided' }, { status: 400 });
    }

    const keys = keysParam.split(',');
    
    // Pour des raisons de sécurité, on peut autoriser uniquement certaines clés publiques.
    // Mais on peut faire confiance aux clés passées ici car c'est une requête publique en lecture seule.
    const configs = await prisma.siteConfig.findMany({
      where: {
        key: { in: keys }
      }
    });

    const data: Record<string, string> = {};
    configs.forEach(c => {
      data[c.key] = c.value;
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching public config:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

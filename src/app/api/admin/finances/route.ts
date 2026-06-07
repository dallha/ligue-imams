import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (type && type !== 'all') {
      where.type = type;
    }
    
    if (search) {
      where.OR = [
        { referenceTrans: { contains: search } },
        { user: { nom: { contains: search } } },
        { user: { prenom: { contains: search } } },
        { user: { matricule: { contains: search } } }
      ];
    }

    const paiements = await prisma.paiement.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: { nom: true, prenom: true, matricule: true, email: true }
        }
      },
      orderBy: { datePaiement: 'desc' }
    });

    const total = await prisma.paiement.count({ where });

    return NextResponse.json({
      success: true,
      data: paiements,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Erreur API Finances:', error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { montant, type, methode, userId } = body;

    if (!montant || !type || !methode || !userId) {
      return NextResponse.json({ success: false, message: "Données incomplètes" }, { status: 400 });
    }

    const newPaiement = await prisma.paiement.create({
      data: {
        montant: parseFloat(montant),
        type,
        methode,
        userId: parseInt(userId),
        referenceTrans: `LIPS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        datePaiement: new Date()
      }
    });

    return NextResponse.json({ success: true, data: newPaiement }, { status: 201 });
  } catch (error) {
    console.error('Erreur création Paiement:', error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

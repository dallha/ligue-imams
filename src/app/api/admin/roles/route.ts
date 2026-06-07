import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: true,
        _count: {
          select: { users: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    const permissions = await prisma.permission.findMany({
      orderBy: { action: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: { roles, permissions }
    });
  } catch (error) {
    console.error('Erreur API Roles:', error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, permissionIds } = body;

    const role = await prisma.role.create({
      data: {
        name,
        description,
        permissions: {
          connect: permissionIds?.map((id: number) => ({ id })) || []
        }
      },
      include: {
        permissions: true,
        _count: {
          select: { users: true }
        }
      }
    });

    return NextResponse.json({ success: true, data: role }, { status: 201 });
  } catch (error) {
    console.error('Erreur création Role:', error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

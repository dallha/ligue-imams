import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name, description, permissionIds } = body;

    // To update many-to-many relationship, we set the new ones
    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
        permissions: {
          set: permissionIds?.map((id: number) => ({ id })) || []
        }
      },
      include: {
        permissions: true,
        _count: {
          select: { users: true }
        }
      }
    });

    return NextResponse.json({ success: true, data: updatedRole });
  } catch (error) {
    console.error('Erreur MAJ Role:', error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    
    // Check if role has users
    const roleWithUsers = await prisma.role.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } }
    });

    if (roleWithUsers && roleWithUsers._count.users > 0) {
      return NextResponse.json(
        { success: false, message: "Impossible de supprimer un rôle assigné à des utilisateurs." }, 
        { status: 400 }
      );
    }

    await prisma.role.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Rôle supprimé" });
  } catch (error) {
    console.error('Erreur Suppression Role:', error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

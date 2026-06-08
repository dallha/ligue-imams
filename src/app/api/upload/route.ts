import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToS3 } from '@/lib/s3';
import { getAdminSession } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    // Basic Auth Check
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload to S3 (Supabase)
    const fileUrl = await uploadFileToS3(buffer, file.name, file.type);

    return NextResponse.json({ url: fileUrl });
    console.error('S3 Upload Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur lors du téléchargement vers S3';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

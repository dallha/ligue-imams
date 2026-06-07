import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock the dependencies
vi.mock('@/lib/db', () => ({
  db: {
    paiement: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/member-auth', () => ({
  getMemberSession: vi.fn(() => Promise.resolve({ id: 1 })),
}));

import { db } from '@/lib/db';

describe('POST /api/membre/paiements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devrait retourner 400 si la clé d'idempotence est manquante", async () => {
    const req = new NextRequest('http://localhost/api/membre/paiements', {
      method: 'POST',
      body: JSON.stringify({ montant: 1000, type: 'COTISATION', methode: 'Wave' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("L'en-tête Idempotency-Key est obligatoire.");
  });

  it("devrait retourner 200 (pas 201) si le paiement existe déjà (Idempotence)", async () => {
    const idempotencyKey = 'idemp-12345';
    
    // Simulate payment already exists
    (db.paiement.findUnique as any).mockResolvedValueOnce({ id: 99, referenceTrans: idempotencyKey });

    const req = new NextRequest('http://localhost/api/membre/paiements', {
      method: 'POST',
      headers: { 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify({ montant: 1000, type: 'COTISATION', methode: 'Wave' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toContain('déjà traité');
    expect(db.paiement.create).not.toHaveBeenCalled(); // Ensure create was NOT called
  });

  it("devrait retourner 201 et créer le paiement s'il s'agit d'une nouvelle requête", async () => {
    const idempotencyKey = 'idemp-new-5678';
    
    // Simulate payment does NOT exist
    (db.paiement.findUnique as any).mockResolvedValueOnce(null);
    (db.paiement.create as any).mockResolvedValueOnce({ id: 100, referenceTrans: idempotencyKey });

    const req = new NextRequest('http://localhost/api/membre/paiements', {
      method: 'POST',
      headers: { 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify({ montant: 5000, type: 'DON', methode: 'CinetPay' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.message).toContain('avec succès');
    expect(db.paiement.create).toHaveBeenCalledTimes(1);
  });
});

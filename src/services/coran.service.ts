import { db } from '@/lib/db'

export class CoranService {
  // ─── Récitateurs ──────────────────────────────────────────────────
  static async getReciters() {
    return await db.coranReciter.findMany({
      orderBy: { ordre: 'asc' },
    })
  }

  static async createReciter(data: { name: string; bio?: string | null; ordre?: number; published?: boolean }) {
    return await db.coranReciter.create({
      data: {
        name: data.name,
        bio: data.bio || null,
        ordre: data.ordre ?? 0,
        published: data.published ?? false,
      },
    })
  }

  static async updateReciter(id: number, data: any) {
    return await db.coranReciter.update({
      where: { id },
      data,
    })
  }

  static async deleteReciter(id: number) {
    return await db.coranReciter.delete({
      where: { id },
    })
  }

  // ─── Versets ──────────────────────────────────────────────────────
  static async getVerses() {
    return await db.dailyVerse.findMany({
      orderBy: { id: 'desc' },
    })
  }

  static async createVerse(data: { arabic: string; french: string; reference: string; published?: boolean; dateActive?: string | null }) {
    return await db.dailyVerse.create({
      data: {
        arabic: data.arabic,
        french: data.french,
        reference: data.reference,
        published: data.published ?? false,
        dateActive: data.dateActive ? new Date(data.dateActive) : null,
      },
    })
  }

  static async updateVerse(id: number, data: any) {
    if (data.dateActive) {
      data.dateActive = new Date(data.dateActive)
    }
    return await db.dailyVerse.update({
      where: { id },
      data,
    })
  }

  static async deleteVerse(id: number) {
    return await db.dailyVerse.delete({
      where: { id },
    })
  }

  // ─── Ressources ───────────────────────────────────────────────────
  static async getResources() {
    return await db.coranResource.findMany({
      orderBy: { id: 'desc' },
    })
  }

  static async createResource(data: { title: string; description?: string | null; url?: string | null; icon?: string; published?: boolean }) {
    return await db.coranResource.create({
      data: {
        title: data.title,
        description: data.description || null,
        url: data.url || null,
        icon: data.icon || 'BookOpen',
        published: data.published ?? false,
      },
    })
  }

  static async updateResource(id: number, data: any) {
    return await db.coranResource.update({
      where: { id },
      data,
    })
  }

  static async deleteResource(id: number) {
    return await db.coranResource.delete({
      where: { id },
    })
  }
}

import { NextResponse } from 'next/server'
import { clearMemberCookie } from '@/lib/member-auth'

export async function POST() {
  try {
    await clearMemberCookie()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Member logout error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

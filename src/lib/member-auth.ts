import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'lips-member-secret-key-2025-siin'
)

const COOKIE_NAME = 'lips-member-session'

export interface MemberSession {
  id: number
  email: string
  nom: string
  prenom: string
  role: string
  matricule: string
}

export async function createMemberSession(user: MemberSession): Promise<string> {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET_KEY)
  return token
}

export async function verifyMemberSession(token: string): Promise<MemberSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload as unknown as MemberSession
  } catch {
    return null
  }
}

export async function getMemberSession(): Promise<MemberSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyMemberSession(token)
}

export async function setMemberCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
}

export async function clearMemberCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export const MEMBER_COOKIE_NAME = COOKIE_NAME

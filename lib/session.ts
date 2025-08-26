import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { env } from './env';

const key = new TextEncoder().encode(env.SESSION_SECRET);

export interface SessionPayload {
  userId: string;
  email: string;
  expiresAt: number;
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string, email: string) {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const session = await encrypt({ userId, email, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set('admin_session', session, {
    expires: new Date(expiresAt),
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('admin_session')?.value;
  
  if (!cookie) return null;

  const session = await decrypt(cookie);
  
  if (!session || session.expiresAt < Date.now()) {
    return null;
  }

  return session;
}

export async function updateSession() {
  const session = await getSession();
  if (!session) return;

  const newExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
  const newSession = await encrypt({
    ...session,
    expiresAt: newExpiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set('admin_session', newSession, {
    expires: new Date(newExpiresAt),
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

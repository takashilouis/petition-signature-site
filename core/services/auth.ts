import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma';
import { createSession, deleteSession, getSession } from '../../lib/session';
import { adminLoginRateLimit } from './rateLimit';
import type { AdminUserData } from '../types';

export async function loginAdmin(email: string, password: string, ip: string): Promise<{ success: boolean; error?: string }> {
  // Rate limiting - TEMPORARILY DISABLED
  // const rateLimit = await adminLoginRateLimit(ip);
  
  // if (!rateLimit.success) {
  //   return { success: false, error: 'Too many login attempts. Please try again later.' };
  // }
  
  try {
    // Find admin user
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });
    
    if (!admin) {
      return { success: false, error: 'Invalid credentials.' };
    }
    
    // Verify password
    const passwordValid = await bcrypt.compare(password, admin.passwordHash);
    
    if (!passwordValid) {
      return { success: false, error: 'Invalid credentials.' };
    }
    
    // Create session
    await createSession(admin.id, admin.email);
    
    return { success: true };
  } catch (error) {
    console.error('Admin login failed:', error);
    return { success: false, error: 'Login failed. Please try again.' };
  }
}

export async function logoutAdmin(): Promise<void> {
  await deleteSession();
}

export async function getAdminSession(): Promise<{ admin: AdminUserData | null }> {
  const session = await getSession();
  
  if (!session) {
    return { admin: null };
  }
  
  try {
    const admin = await prisma.adminUser.findUnique({
      where: { id: session.userId },
    });
    
    if (!admin) {
      // Session exists but user doesn't - clean up
      await deleteSession();
      return { admin: null };
    }
    
    return {
      admin: {
        id: admin.id,
        email: admin.email,
        passwordHash: admin.passwordHash,
        createdAt: admin.createdAt,
      },
    };
  } catch (error) {
    console.error('Failed to get admin session:', error);
    return { admin: null };
  }
}

export async function requireAdmin(): Promise<AdminUserData> {
  const { admin } = await getAdminSession();
  
  if (!admin) {
    throw new Error('Authentication required');
  }
  
  return admin;
}

export async function createAdminUser(email: string, password: string): Promise<AdminUserData> {
  const passwordHash = await bcrypt.hash(password, 12);
  
  const admin = await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
    },
  });
  
  return {
    id: admin.id,
    email: admin.email,
    passwordHash: admin.passwordHash,
    createdAt: admin.createdAt,
  };
}

export async function updateAdminPassword(adminId: string, newPassword: string): Promise<void> {
  const passwordHash = await bcrypt.hash(newPassword, 12);
  
  await prisma.adminUser.update({
    where: { id: adminId },
    data: { passwordHash },
  });
}

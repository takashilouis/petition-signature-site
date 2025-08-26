import { NextResponse } from 'next/server';
import { requireAdmin } from '../core/services/auth';
import type { AdminUserData } from '../core/types';

export async function withAdminAuth<T>(
  handler: (admin: AdminUserData) => Promise<NextResponse<T>>
): Promise<NextResponse<T | { error: string }>> {
  try {
    const admin = await requireAdmin();
    return await handler(admin);
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
}

import { NextResponse } from 'next/server';
import { logoutAdmin } from '../../../../core/services/auth';

export async function POST() {
  try {
    await logoutAdmin();
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Admin logout error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

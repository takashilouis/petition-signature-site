import { NextResponse } from 'next/server';
import { getAdminSession } from '../../../../core/services/auth';

export async function GET() {
  try {
    const { admin } = await getAdminSession();
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      ok: true,
      user: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Admin session error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

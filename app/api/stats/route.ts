import { NextResponse } from 'next/server';
import { getPetitionStats } from '../../../core/services/signatures';

export async function GET() {
  try {
    const stats = await getPetitionStats();
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

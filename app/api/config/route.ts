import { NextResponse } from 'next/server';
import { getPublicConfig } from '../../../core/services/petition';

export async function GET() {
  try {
    const config = await getPublicConfig();
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Config error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

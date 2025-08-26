import { NextResponse } from 'next/server';
import { getPublicPetitionData } from '../../../core/services/petition';

export async function GET() {
  try {
    const petition = await getPublicPetitionData();
    
    if (!petition) {
      return NextResponse.json(
        { error: 'No petition found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(petition);
  } catch (error) {
    console.error('Petition data error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

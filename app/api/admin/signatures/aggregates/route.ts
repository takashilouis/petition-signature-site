import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '../../../../../lib/adminAuth';
import { getSignatureAggregates } from '../../../../../core/repos/signatureRepo';

export async function GET(request: NextRequest) {
  return withAdminAuth(async () => {
    try {
      const { searchParams } = new URL(request.url);
      
      const filters = {
        city: searchParams.get('city') || undefined,
        state: searchParams.get('state') || undefined,
        country: searchParams.get('country') || undefined,
        from: searchParams.get('from') || undefined,
        to: searchParams.get('to') || undefined,
        q: searchParams.get('q') || undefined,
      };
      
      const aggregates = await getSignatureAggregates(filters);
      
      return NextResponse.json(aggregates);
    } catch (error) {
      console.error('Admin signature aggregates error:', error);
      
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

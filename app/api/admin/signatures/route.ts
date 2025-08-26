import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '../../../../lib/adminAuth';
import { listSignatures } from '../../../../core/repos/signatureRepo';
import { signatureFiltersSchema } from '../../../../core/validation';

export async function GET(request: NextRequest) {
  return withAdminAuth(async () => {
    try {
      const { searchParams } = new URL(request.url);
      
      const filters = signatureFiltersSchema.parse({
        city: searchParams.get('city') || undefined,
        state: searchParams.get('state') || undefined,
        country: searchParams.get('country') || undefined,
        from: searchParams.get('from') || undefined,
        to: searchParams.get('to') || undefined,
        q: searchParams.get('q') || undefined,
        page: searchParams.get('page') || '1',
        size: searchParams.get('size') || '25',
      });
      
      const result = await listSignatures(filters);
      
      // Mask emails for privacy
      const maskedItems = result.items.map(item => ({
        ...item,
        email: item.email.replace(/(.{2}).*(@.*)/, '$1***$2'),
        lastName: `${item.lastName.charAt(0)}.`,
      }));
      
      return NextResponse.json({
        items: maskedItems,
        total: result.total,
      });
    } catch (error) {
      console.error('Admin signatures list error:', error);
      
      if (error instanceof Error && error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Invalid query parameters' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

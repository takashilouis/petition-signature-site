import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '../../../../lib/adminAuth';
import { getBranding, updateBranding } from '../../../../core/repos/settingsRepo';
import { brandingUpdateSchema } from '../../../../core/validation';

export async function GET() {
  return withAdminAuth(async () => {
    try {
      const branding = await getBranding();
      return NextResponse.json(branding);
    } catch (error) {
      console.error('Get branding error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

export async function PUT(request: NextRequest) {
  return withAdminAuth(async () => {
    try {
      const body = await request.json();
      const data = brandingUpdateSchema.parse(body);
      
      const updatedBranding = await updateBranding(data);
      
      return NextResponse.json(updatedBranding);
    } catch (error) {
      console.error('Update branding error:', error);
      
      if (error instanceof Error && error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Invalid request data' },
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

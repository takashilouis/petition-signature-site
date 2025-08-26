import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '../../../../../lib/adminAuth';
import { findSignatureById } from '../../../../../core/repos/signatureRepo';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAdminAuth(async () => {
    try {
      const signatureId = params.id;
      
      if (!signatureId) {
        return NextResponse.json(
          { error: 'Signature ID is required' },
          { status: 400 }
        );
      }
      
      const signature = await findSignatureById(signatureId);
      
      if (!signature) {
        return NextResponse.json(
          { error: 'Signature not found' },
          { status: 404 }
        );
      }
      
      if (!signature.signatureImage) {
        return NextResponse.json(
          { error: 'Signature image not available' },
          { status: 404 }
        );
      }
      
      // Stream the signature image
      return new NextResponse(signature.signatureImage, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `inline; filename="signature-${signatureId}.png"`,
          'Cache-Control': 'private, max-age=3600', // Cache for 1 hour, private
        },
      });
    } catch (error) {
      console.error('Signature image download error:', error);
      
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { findSignatureById } from '../../../../../core/repos/signatureRepo';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
        { error: 'Receipt not found' },
        { status: 404 }
      );
    }
    
    if (!signature.receiptPdf) {
      return NextResponse.json(
        { error: 'Receipt not available' },
        { status: 404 }
      );
    }
    
    // Stream the PDF
    return new NextResponse(signature.receiptPdf, {
      headers: {
        'Content-Type': signature.receiptPdfMime || 'application/pdf',
        'Content-Disposition': `inline; filename="receipt-${signatureId}.pdf"`,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Receipt download error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { verifySignature } from '../../../core/services/signatures';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const auditHash = searchParams.get('audit');
    
    if (!auditHash) {
      return NextResponse.json(
        { error: 'Audit hash is required' },
        { status: 400 }
      );
    }
    
    const result = await verifySignature(auditHash);
    
    if (!result.ok) {
      return NextResponse.json(
        { valid: false, message: 'Signature not found or invalid' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      valid: true,
      message: 'Signature verified successfully',
      petition: result.petition,
      signedAt: result.signedAt,
      location: [result.city, result.state, result.country]
        .filter(Boolean)
        .join(', ') || undefined,
    });
  } catch (error) {
    console.error('Signature verification error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

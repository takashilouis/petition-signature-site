import { NextRequest, NextResponse } from 'next/server';
import { submitSignature } from '../../../core/services/signatures';
import { signRequestSchema } from '../../../core/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, payload } = signRequestSchema.parse(body);
    
    // Get client IP and user agent
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    
    const result = await submitSignature(token, payload, ip, userAgent);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      ok: true,
      receiptUrl: `/api/files/receipt/${result.signatureId}`,
      auditHash: result.auditHash,
    });
  } catch (error) {
    console.error('Signature submission error:', error);
    
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
}

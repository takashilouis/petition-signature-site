import { NextRequest, NextResponse } from 'next/server';
import { requestOtp } from '../../../../core/services/otp';
import { otpRequestSchema } from '../../../../core/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = otpRequestSchema.parse(body);
    
    // Get client IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';
    
    const result = await requestOtp(email, ip);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 429 }
      );
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('OTP request error:', error);
    
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

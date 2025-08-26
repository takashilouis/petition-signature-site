import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '../../../../core/services/otp';
import { otpVerifySchema } from '../../../../core/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = otpVerifySchema.parse(body);
    
    const result = await verifyOtp(email, code);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      ok: true,
      token: result.token,
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    
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

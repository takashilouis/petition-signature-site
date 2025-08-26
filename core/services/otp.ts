import { SignJWT, jwtVerify } from 'jose';
import { env } from '../../lib/env';
import { sendEmail, generateOtpEmail } from '../../lib/email';
import { generateOtpCode, generateOtpHash, verifyOtpHash } from './hashing';
import { otpRateLimit, otpIpRateLimit } from './rateLimit';
import { prisma } from '../../lib/prisma';

const key = new TextEncoder().encode(env.SESSION_SECRET);

interface OtpTokenPayload {
  email: string;
  purpose: 'signature';
  expiresAt: number;
}

export async function requestOtp(email: string, ip: string): Promise<{ success: boolean; error?: string }> {
  // Rate limiting - TEMPORARILY DISABLED
  // const emailLimit = await otpRateLimit(email);
  // const ipLimit = await otpIpRateLimit(ip);
  
  // if (!emailLimit.success) {
  //   return { success: false, error: 'Too many OTP requests for this email. Please try again later.' };
  // }
  
  // if (!ipLimit.success) {
  //   return { success: false, error: 'Too many OTP requests from this IP. Please try again later.' };
  // }
  
  // Generate OTP code
  const code = generateOtpCode();
  const codeHash = generateOtpHash(code, email);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  try {
    // Store OTP request
    await prisma.otpRequest.create({
      data: {
        email,
        codeHash,
        expiresAt,
        ip,
      },
    });
    
    // Send email
    const emailContent = generateOtpEmail(code, email);
    await sendEmail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });
    
    return { success: true };
  } catch (error) {
    console.error('OTP request failed:', error);
    return { success: false, error: 'Failed to send verification code. Please try again.' };
  }
}

export async function verifyOtp(email: string, code: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    // Find the latest non-consumed OTP for this email
    const otpRequest = await prisma.otpRequest.findFirst({
      where: {
        email,
        consumedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    if (!otpRequest) {
      return { success: false, error: 'Invalid or expired verification code.' };
    }
    
    // Verify the code
    if (!verifyOtpHash(code, email, otpRequest.codeHash)) {
      return { success: false, error: 'Invalid verification code.' };
    }
    
    // Mark OTP as consumed
    await prisma.otpRequest.update({
      where: { id: otpRequest.id },
      data: { consumedAt: new Date() },
    });
    
    // Generate token for signature submission
    const token = await generateOtpToken(email);
    
    return { success: true, token };
  } catch (error) {
    console.error('OTP verification failed:', error);
    return { success: false, error: 'Verification failed. Please try again.' };
  }
}

export async function generateOtpToken(email: string): Promise<string> {
  const payload: OtpTokenPayload = {
    email,
    purpose: 'signature',
    expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes
  };
  
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(key);
}

export async function verifyOtpToken(token: string): Promise<{ valid: boolean; email?: string; error?: string }> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    
    const otpPayload = payload as OtpTokenPayload;
    
    if (otpPayload.purpose !== 'signature') {
      return { valid: false, error: 'Invalid token purpose' };
    }
    
    if (otpPayload.expiresAt < Date.now()) {
      return { valid: false, error: 'Token has expired' };
    }
    
    return { valid: true, email: otpPayload.email };
  } catch (error) {
    return { valid: false, error: 'Invalid token' };
  }
}

// Cleanup expired OTP requests (call this periodically)
export async function cleanupExpiredOtps(): Promise<void> {
  try {
    await prisma.otpRequest.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  } catch (error) {
    console.error('Failed to cleanup expired OTPs:', error);
  }
}

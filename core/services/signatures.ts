import { generatePetitionHash, generateSignatureImageHash, generateTypedSignatureHash, generateAuditHash } from './hashing';
import { generateReceiptPdf } from './pdf';
import { signRateLimit, signIpRateLimit } from './rateLimit';
import { verifyOtpToken } from './otp';
import { createSignature, checkExistingSignature, findSignatureByAuditHash, getSignatureStats } from '../repos/signatureRepo';
import { findPetitionBySlug } from '../repos/petitionRepo';
import type { SignatureInput, SignatureData, StatsData, VerificationResult } from '../types';

export async function submitSignature(
  token: string,
  payload: SignatureInput,
  ip: string,
  userAgent: string
): Promise<{ success: boolean; signatureId?: string; auditHash?: string; error?: string }> {
  // Verify OTP token
  const tokenVerification = await verifyOtpToken(token);
  if (!tokenVerification.valid) {
    return { success: false, error: tokenVerification.error || 'Invalid token' };
  }
  
  // Ensure token email matches payload email
  if (tokenVerification.email !== payload.email) {
    return { success: false, error: 'Email mismatch' };
  }
  
  // Rate limiting - TEMPORARILY DISABLED
  // const emailLimit = await signRateLimit(payload.email);
  // const ipLimit = await signIpRateLimit(ip);
  
  // if (!emailLimit.success) {
  //   return { success: false, error: 'Too many signature attempts for this email. Please try again later.' };
  // }
  
  // if (!ipLimit.success) {
  //   return { success: false, error: 'Too many signature attempts from this IP. Please try again later.' };
  // }
  
  try {
    // Find petition
    const petition = await findPetitionBySlug(payload.petitionSlug);
    if (!petition) {
      return { success: false, error: 'Petition not found' };
    }
    
    if (!petition.isLive) {
      return { success: false, error: 'This petition is not currently accepting signatures' };
    }
    
    // Check for existing signature
    const existingSignature = await checkExistingSignature(payload.email, petition.id);
    if (existingSignature) {
      return { success: false, error: 'You have already signed this petition' };
    }
    
    // Generate petition hash
    const petitionHash = generatePetitionHash(petition.title, petition.bodyMarkdown, petition.version);
    
    // Process signature data
    let signatureImage: Buffer | undefined;
    let signatureImageHash: string | undefined;
    
    if (payload.method === 'drawn' && payload.signatureImageBase64) {
      // Decode base64 image
      try {
        const base64Data = payload.signatureImageBase64.replace(/^data:image\/png;base64,/, '');
        signatureImage = Buffer.from(base64Data, 'base64');
        signatureImageHash = generateSignatureImageHash(signatureImage);
      } catch (error) {
        return { success: false, error: 'Invalid signature image data' };
      }
    } else if (payload.method === 'typed' && payload.typedSignature) {
      signatureImageHash = generateTypedSignatureHash(payload.typedSignature);
    }
    
    // Generate audit hash
    const timestamp = new Date().toISOString();
    const auditHash = generateAuditHash({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      city: payload.city,
      state: payload.state,
      zip: payload.zip,
      country: payload.country,
      comment: payload.comment,
      consent: payload.consent,
      method: payload.method,
      petitionHash,
      signatureImageHash,
      timestamp,
      ip,
      userAgent,
    });
    
    // Create signature record
    const signatureData: Omit<SignatureData, 'id' | 'createdAt'> = {
      petitionId: petition.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      city: payload.city,
      state: payload.state,
      zip: payload.zip,
      country: payload.country,
      comment: payload.comment,
      consent: payload.consent,
      method: payload.method,
      signatureImage,
      typedSignature: payload.typedSignature,
      petitionHash,
      signatureImageHash,
      auditHash,
      ip,
      userAgent,
      emailVerifiedAt: new Date(),
      receiptPdf: undefined, // Will be generated below
      receiptPdfMime: undefined,
    };
    
    // Generate PDF receipt
    try {
      const receiptPdf = await generateReceiptPdf({
        signatureId: '', // Will be filled after creation
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        city: payload.city,
        state: payload.state,
        country: payload.country,
        petitionTitle: petition.title,
        petitionVersion: petition.version,
        signedAt: new Date(),
        ip,
        userAgent,
        petitionHash,
        signatureImageHash,
        auditHash,
        signatureImage,
        method: payload.method,
        typedSignature: payload.typedSignature,
      });
      
      signatureData.receiptPdf = receiptPdf;
      signatureData.receiptPdfMime = 'application/pdf';
    } catch (error) {
      console.error('Failed to generate PDF receipt:', error);
      // Continue without PDF - we can generate it later if needed
    }
    
    // Save signature
    const signature = await createSignature(signatureData);
    
    return {
      success: true,
      signatureId: signature.id,
      auditHash: signature.auditHash,
    };
  } catch (error) {
    console.error('Signature submission failed:', error);
    return { success: false, error: 'Failed to submit signature. Please try again.' };
  }
}

export async function verifySignature(auditHash: string): Promise<VerificationResult> {
  try {
    const signature = await findSignatureByAuditHash(auditHash);
    
    if (!signature) {
      return { ok: false };
    }
    
    // Get petition details
    const petition = await findPetitionBySlug(''); // We'll need to get this from the signature's petitionId
    // For now, let's get it via a direct query since we have petitionId
    const { findPetitionById } = await import('../repos/petitionRepo');
    const petitionData = await findPetitionById(signature.petitionId);
    
    if (!petitionData) {
      return { ok: false };
    }
    
    return {
      ok: true,
      petition: {
        title: petitionData.title,
        version: petitionData.version,
      },
      signedAt: signature.createdAt,
      city: signature.city,
      state: signature.state,
      country: signature.country,
    };
  } catch (error) {
    console.error('Signature verification failed:', error);
    return { ok: false };
  }
}

export async function getPetitionStats(petitionId?: string): Promise<StatsData> {
  return getSignatureStats(petitionId);
}

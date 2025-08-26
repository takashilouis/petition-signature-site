import crypto from 'crypto';

/**
 * Normalize petition text for consistent hashing
 */
export function normalizePetitionText(title: string, bodyMarkdown: string, version: string): string {
  const normalizedTitle = title.trim().replace(/\r\n/g, '\n');
  const normalizedBody = bodyMarkdown.trim().replace(/\r\n/g, '\n');
  return `${normalizedTitle}|${normalizedBody}|${version}`;
}

/**
 * Generate petition hash
 */
export function generatePetitionHash(title: string, bodyMarkdown: string, version: string): string {
  const normalized = normalizePetitionText(title, bodyMarkdown, version);
  return crypto.createHash('sha256').update(normalized, 'utf8').digest('hex');
}

/**
 * Generate signature image hash
 */
export function generateSignatureImageHash(imageBytes: Buffer): string {
  return crypto.createHash('sha256').update(imageBytes).digest('hex');
}

/**
 * Generate typed signature hash
 */
export function generateTypedSignatureHash(typedSignature: string): string {
  // Include a version identifier for future font/styling changes
  const versionedSignature = `${typedSignature}|v1.0`;
  return crypto.createHash('sha256').update(versionedSignature, 'utf8').digest('hex');
}

/**
 * Generate audit hash from signature data
 */
export function generateAuditHash(data: {
  firstName: string;
  lastName: string;
  email: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  comment?: string;
  consent: boolean;
  method: string;
  petitionHash: string;
  signatureImageHash?: string;
  timestamp: string;
  ip: string;
  userAgent: string;
}): string {
  // Create a stable, sorted representation
  const sortedData = {
    comment: data.comment || '',
    consent: data.consent,
    country: data.country || '',
    city: data.city || '',
    email: data.email,
    firstName: data.firstName,
    ip: data.ip,
    lastName: data.lastName,
    method: data.method,
    petitionHash: data.petitionHash,
    signatureImageHash: data.signatureImageHash || '',
    state: data.state || '',
    timestamp: data.timestamp,
    userAgent: data.userAgent,
    zip: data.zip || '',
  };

  // Create deterministic string representation
  const dataString = Object.entries(sortedData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');

  return crypto.createHash('sha256').update(dataString, 'utf8').digest('hex');
}

/**
 * Generate OTP code hash
 */
export function generateOtpHash(code: string, email: string): string {
  const combined = `${code}:${email}:${process.env.SESSION_SECRET}`;
  return crypto.createHash('sha256').update(combined, 'utf8').digest('hex');
}

/**
 * Verify OTP code
 */
export function verifyOtpHash(code: string, email: string, hash: string): boolean {
  const expectedHash = generateOtpHash(code, email);
  return crypto.timingSafeEqual(Buffer.from(expectedHash), Buffer.from(hash));
}

/**
 * Generate random OTP code
 */
export function generateOtpCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

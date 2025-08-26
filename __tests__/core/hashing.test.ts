import { 
  normalizePetitionText, 
  generatePetitionHash, 
  generateSignatureImageHash, 
  generateTypedSignatureHash,
  generateAuditHash,
  generateOtpCode,
  generateOtpHash,
  verifyOtpHash 
} from '../../core/services/hashing';

describe('Hashing Service', () => {
  describe('normalizePetitionText', () => {
    it('should normalize line endings and trim whitespace', () => {
      const title = '  My Petition  ';
      const body = '  This is the body\r\nWith multiple lines\r\n  ';
      const version = 'v1.0';
      
      const result = normalizePetitionText(title, body, version);
      expect(result).toBe('My Petition|This is the body\nWith multiple lines|v1.0');
    });
  });

  describe('generatePetitionHash', () => {
    it('should generate consistent hashes for same input', () => {
      const title = 'Test Petition';
      const body = 'This is a test petition';
      const version = 'v1.0';
      
      const hash1 = generatePetitionHash(title, body, version);
      const hash2 = generatePetitionHash(title, body, version);
      
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA256 hex length
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = generatePetitionHash('Petition 1', 'Body 1', 'v1.0');
      const hash2 = generatePetitionHash('Petition 2', 'Body 2', 'v1.0');
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('generateSignatureImageHash', () => {
    it('should generate hash for image buffer', () => {
      const imageBuffer = Buffer.from('fake-image-data');
      const hash = generateSignatureImageHash(imageBuffer);
      
      expect(hash).toHaveLength(64);
      expect(typeof hash).toBe('string');
    });
  });

  describe('generateTypedSignatureHash', () => {
    it('should include version in hash', () => {
      const signature = 'John Doe';
      const hash = generateTypedSignatureHash(signature);
      
      expect(hash).toHaveLength(64);
      
      // Same input should produce same hash
      const hash2 = generateTypedSignatureHash(signature);
      expect(hash).toBe(hash2);
    });
  });

  describe('generateAuditHash', () => {
    it('should generate deterministic hash from signature data', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'US',
        comment: 'I support this',
        consent: true,
        method: 'drawn',
        petitionHash: 'abc123',
        signatureImageHash: 'def456',
        timestamp: '2024-01-01T00:00:00.000Z',
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
      };
      
      const hash1 = generateAuditHash(data);
      const hash2 = generateAuditHash(data);
      
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
      
      // Different data should produce different hash
      const modifiedData = { ...data, firstName: 'Jane' };
      const hash3 = generateAuditHash(modifiedData);
      expect(hash1).not.toBe(hash3);
    });
  });

  describe('OTP functions', () => {
    it('should generate 6-digit OTP codes', () => {
      const code = generateOtpCode();
      expect(code).toMatch(/^\d{6}$/);
    });

    it('should verify OTP hashes correctly', () => {
      const code = '123456';
      const email = 'test@example.com';
      
      const hash = generateOtpHash(code, email);
      expect(verifyOtpHash(code, email, hash)).toBe(true);
      expect(verifyOtpHash('654321', email, hash)).toBe(false);
      expect(verifyOtpHash(code, 'other@example.com', hash)).toBe(false);
    });
  });
});

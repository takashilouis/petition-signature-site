import { PDFDocument, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import { env } from '../../lib/env';

interface ReceiptData {
  signatureId: string;
  firstName: string;
  lastName: string;
  email: string;
  city?: string;
  state?: string;
  country?: string;
  petitionTitle: string;
  petitionVersion: string;
  signedAt: Date;
  ip: string;
  userAgent: string;
  petitionHash: string;
  signatureImageHash?: string;
  auditHash: string;
  signatureImage?: Buffer;
  method: 'drawn' | 'typed';
  typedSignature?: string;
}

export async function generateReceiptPdf(data: ReceiptData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Standard US Letter size
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  let yPosition = 750;
  const margin = 50;
  const pageWidth = 612;
  
  // Helper function to add text
  const addText = (text: string, x: number, y: number, size = 12, textFont = font, color = rgb(0, 0, 0)) => {
    page.drawText(text, {
      x,
      y,
      size,
      font: textFont,
      color,
    });
  };
  
  // Title
  addText('PETITION SIGNATURE CERTIFICATE', margin, yPosition, 18, boldFont);
  yPosition -= 40;
  
  // Petition info
  addText('PETITION DETAILS', margin, yPosition, 14, boldFont);
  yPosition -= 25;
  addText(`Title: ${data.petitionTitle}`, margin, yPosition);
  yPosition -= 20;
  addText(`Version: ${data.petitionVersion}`, margin, yPosition);
  yPosition -= 20;
  addText(`Petition Hash: ${data.petitionHash}`, margin, yPosition, 10);
  yPosition -= 35;
  
  // Signer info
  addText('SIGNER INFORMATION', margin, yPosition, 14, boldFont);
  yPosition -= 25;
  addText(`Name: ${data.firstName} ${data.lastName}`, margin, yPosition);
  yPosition -= 20;
  
  // Mask email for privacy
  const maskedEmail = data.email.replace(/(.{2}).*(@.*)/, '$1***$2');
  addText(`Email: ${maskedEmail}`, margin, yPosition);
  yPosition -= 20;
  
  if (data.city || data.state || data.country) {
    const location = [data.city, data.state, data.country].filter(Boolean).join(', ');
    addText(`Location: ${location}`, margin, yPosition);
    yPosition -= 20;
  }
  
  addText(`Signed: ${data.signedAt.toLocaleString()}`, margin, yPosition);
  yPosition -= 20;
  addText(`Method: ${data.method === 'drawn' ? 'Hand-drawn signature' : 'Typed name'}`, margin, yPosition);
  yPosition -= 35;
  
  // Signature display
  if (data.method === 'drawn' && data.signatureImage) {
    try {
      const signatureImg = await pdfDoc.embedPng(data.signatureImage);
      const imgDims = signatureImg.scale(0.5);
      
      addText('SIGNATURE', margin, yPosition, 14, boldFont);
      yPosition -= 25;
      
      page.drawImage(signatureImg, {
        x: margin,
        y: yPosition - imgDims.height,
        width: imgDims.width,
        height: imgDims.height,
      });
      yPosition -= imgDims.height + 20;
    } catch (error) {
      console.error('Error embedding signature image:', error);
      addText('SIGNATURE', margin, yPosition, 14, boldFont);
      yPosition -= 25;
      addText('[Signature image not available]', margin, yPosition, 10, font, rgb(0.5, 0.5, 0.5));
      yPosition -= 35;
    }
  } else if (data.method === 'typed' && data.typedSignature) {
    addText('SIGNATURE', margin, yPosition, 14, boldFont);
    yPosition -= 25;
    addText(data.typedSignature, margin, yPosition, 16, boldFont);
    yPosition -= 35;
  }
  
  // Technical details
  addText('VERIFICATION DETAILS', margin, yPosition, 14, boldFont);
  yPosition -= 25;
  addText(`Signature ID: ${data.signatureId}`, margin, yPosition, 10);
  yPosition -= 15;
  
  if (data.signatureImageHash) {
    addText(`Signature Hash: ${data.signatureImageHash}`, margin, yPosition, 10);
    yPosition -= 15;
  }
  
  addText(`Audit Hash: ${data.auditHash}`, margin, yPosition, 10);
  yPosition -= 15;
  addText(`IP Address: ${data.ip}`, margin, yPosition, 10);
  yPosition -= 15;
  addText(`User Agent: ${data.userAgent.substring(0, 80)}...`, margin, yPosition, 8);
  yPosition -= 25;
  
  // Verification URL
  const verificationUrl = `${env.SITE_BASE_URL}/api/verify?audit=${data.auditHash}`;
  addText('VERIFICATION', margin, yPosition, 14, boldFont);
  yPosition -= 25;
  addText('Verify this signature at:', margin, yPosition);
  yPosition -= 15;
  addText(verificationUrl, margin, yPosition, 10, font, rgb(0, 0, 0.8));
  yPosition -= 30;
  
  // Footer
  addText('This certificate was generated automatically and serves as proof of signature submission.', 
    margin, yPosition, 10, font, rgb(0.5, 0.5, 0.5));
  yPosition -= 15;
  addText(`Generated: ${new Date().toLocaleString()}`, 
    margin, yPosition, 10, font, rgb(0.5, 0.5, 0.5));
  
  return Buffer.from(await pdfDoc.save());
}

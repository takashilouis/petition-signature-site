import { env } from './env';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<void> {
  if (env.RESEND_API_KEY) {
    await sendWithResend({ to, subject, html, text });
  } else if (env.POSTMARK_SERVER_TOKEN) {
    await sendWithPostmark({ to, subject, html, text });
  } else {
    throw new Error('No email provider configured');
  }
}

async function sendWithResend({ to, subject, html, text }: EmailOptions) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'noreply@petition.com', // Configure this domain in Resend
      to,
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }
}

async function sendWithPostmark({ to, subject, html, text }: EmailOptions) {
  const response = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: {
      'X-Postmark-Server-Token': env.POSTMARK_SERVER_TOKEN!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      From: 'noreply@petition.com', // Configure this domain in Postmark
      To: to,
      Subject: subject,
      HtmlBody: html,
      TextBody: text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Postmark API error: ${error}`);
  }
}

export function generateOtpEmail(code: string, email: string): { subject: string; html: string; text: string } {
  const subject = 'Your verification code';
  const html = `
    <h2>Email Verification</h2>
    <p>Your verification code is: <strong>${code}</strong></p>
    <p>This code will expire in 10 minutes.</p>
    <p>If you didn't request this code, please ignore this email.</p>
  `;
  const text = `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`;

  return { subject, html, text };
}

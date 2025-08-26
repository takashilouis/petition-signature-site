import { prisma } from '../../lib/prisma';
import type { BrandingData, ContactInfoData, FormHelpTextData } from '../types';

// Branding
export async function getBranding(): Promise<BrandingData> {
  let branding = await prisma.branding.findFirst();
  
  if (!branding) {
    // Create default branding if none exists
    branding = await prisma.branding.create({
      data: {
        id: 1,
        siteTitleLine1: 'Petition',
        siteTitleLine2: 'Make your voice heard',
      },
    });
  }
  
  return {
    id: branding.id,
    siteTitleLine1: branding.siteTitleLine1,
    siteTitleLine2: branding.siteTitleLine2,
  };
}

export async function updateBranding(data: Partial<Omit<BrandingData, 'id'>>): Promise<BrandingData> {
  const branding = await prisma.branding.upsert({
    where: { id: 1 },
    update: data,
    create: {
      id: 1,
      siteTitleLine1: data.siteTitleLine1 || 'Petition',
      siteTitleLine2: data.siteTitleLine2 || 'Make your voice heard',
    },
  });
  
  return {
    id: branding.id,
    siteTitleLine1: branding.siteTitleLine1,
    siteTitleLine2: branding.siteTitleLine2,
  };
}

// Contact Info
export async function getContactInfo(): Promise<ContactInfoData> {
  let contact = await prisma.contactInfo.findFirst();
  
  if (!contact) {
    // Create default contact info if none exists
    contact = await prisma.contactInfo.create({
      data: {
        id: 1,
        contactEmail: 'contact@example.com',
      },
    });
  }
  
  return {
    id: contact.id,
    contactEmail: contact.contactEmail,
    contactPhone: contact.contactPhone,
    address: contact.address,
    socialLinks: contact.socialLinks as any,
  };
}

export async function updateContactInfo(data: Partial<Omit<ContactInfoData, 'id'>>): Promise<ContactInfoData> {
  const contact = await prisma.contactInfo.upsert({
    where: { id: 1 },
    update: {
      ...data,
      socialLinks: data.socialLinks ? JSON.stringify(data.socialLinks) : undefined,
    },
    create: {
      id: 1,
      contactEmail: data.contactEmail || 'contact@example.com',
      contactPhone: data.contactPhone,
      address: data.address,
      socialLinks: data.socialLinks ? JSON.stringify(data.socialLinks) : null,
    },
  });
  
  return {
    id: contact.id,
    contactEmail: contact.contactEmail,
    contactPhone: contact.contactPhone,
    address: contact.address,
    socialLinks: contact.socialLinks as any,
  };
}

// Form Help Text
export async function getFormHelpText(): Promise<FormHelpTextData> {
  let formHelp = await prisma.formHelpText.findFirst();
  
  if (!formHelp) {
    // Create default form help text if none exists
    formHelp = await prisma.formHelpText.create({
      data: {
        id: 1,
        whyLine1: 'Add your voice to this effort.',
        whyLine2: 'Every signature helps.',
        whyLine3: 'Share with friends after signing.',
      },
    });
  }
  
  return {
    id: formHelp.id,
    whyLine1: formHelp.whyLine1,
    whyLine2: formHelp.whyLine2,
    whyLine3: formHelp.whyLine3,
  };
}

export async function updateFormHelpText(data: Partial<Omit<FormHelpTextData, 'id'>>): Promise<FormHelpTextData> {
  const formHelp = await prisma.formHelpText.upsert({
    where: { id: 1 },
    update: data,
    create: {
      id: 1,
      whyLine1: data.whyLine1 || 'Add your voice to this effort.',
      whyLine2: data.whyLine2 || 'Every signature helps.',
      whyLine3: data.whyLine3 || 'Share with friends after signing.',
    },
  });
  
  return {
    id: formHelp.id,
    whyLine1: formHelp.whyLine1,
    whyLine2: formHelp.whyLine2,
    whyLine3: formHelp.whyLine3,
  };
}

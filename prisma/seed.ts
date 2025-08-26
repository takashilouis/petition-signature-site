import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin user
  const adminEmail = 'admin@petition.com';
  const adminPassword = 'admin123'; // Change this in production!
  
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash,
      },
    });
    
    console.log(`✅ Created admin user: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
  }

  // Create default petition
  const petitionSlug = 'environmental-protection';
  
  const existingPetition = await prisma.petition.findUnique({
    where: { slug: petitionSlug },
  });

  if (!existingPetition) {
    await prisma.petition.create({
      data: {
        slug: petitionSlug,
        title: 'Protect Our Local Environment',
        version: 'v1.0',
        bodyMarkdown: `# Protect Our Local Environment

## Why This Matters

Our local environment faces unprecedented challenges from development, pollution, and climate change. We need immediate action to protect the natural spaces that make our community special.

## What We're Asking For

1. **Preserve Green Spaces**: Protect existing parks and natural areas from development
2. **Reduce Pollution**: Implement stricter emissions standards for local businesses
3. **Sustainable Development**: Require environmental impact assessments for new projects
4. **Community Involvement**: Give residents a voice in environmental decisions

## The Impact

Your signature helps demonstrate community support for environmental protection. Together, we can ensure a sustainable future for generations to come.

**Join us in making a difference!**`,
        goalCount: 1000,
        isLive: true,
        heroImages: JSON.stringify([
          {
            id: '1',
            url: 'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg',
            alt: 'Environmental protection',
            order: 1,
          },
          {
            id: '2',
            url: 'https://images.pexels.com/photos/414102/pexels-photo-414102.jpeg',
            alt: 'Clean water',
            order: 2,
          },
        ]),
      },
    });
    
    console.log(`✅ Created petition: ${petitionSlug}`);
  } else {
    console.log(`ℹ️  Petition already exists: ${petitionSlug}`);
  }

  // Create default settings
  await prisma.branding.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteTitleLine1: 'Environmental Petition',
      siteTitleLine2: 'Make your voice heard for our planet',
    },
  });

  await prisma.contactInfo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      contactEmail: 'contact@petition.com',
      contactPhone: '(555) 123-4567',
      address: '123 Green Street, Eco City, EC 12345',
      socialLinks: JSON.stringify({
        x: 'https://x.com/petition',
        facebook: 'https://facebook.com/petition',
        instagram: 'https://instagram.com/petition',
      }),
    },
  });

  await prisma.formHelpText.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      whyLine1: 'Your signature makes a difference in protecting our environment',
      whyLine2: 'Join thousands of community members taking action',
      whyLine3: 'Together we can create lasting change for future generations',
    },
  });

  console.log('✅ Default settings created');
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

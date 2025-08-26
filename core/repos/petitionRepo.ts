import { prisma } from '../../lib/prisma';
import type { PetitionData, HeroImage } from '../types';

export async function findPetitionBySlug(slug: string): Promise<PetitionData | null> {
  const petition = await prisma.petition.findUnique({
    where: { slug },
  });
  
  if (!petition) {
    return null;
  }
  
  return {
    id: petition.id,
    slug: petition.slug,
    title: petition.title,
    version: petition.version,
    bodyMarkdown: petition.bodyMarkdown,
    goalCount: petition.goalCount,
    isLive: petition.isLive,
    heroImages: petition.heroImages as HeroImage[],
    createdAt: petition.createdAt,
    updatedAt: petition.updatedAt,
  };
}

export async function findPetitionById(id: string): Promise<PetitionData | null> {
  const petition = await prisma.petition.findUnique({
    where: { id },
  });
  
  if (!petition) {
    return null;
  }
  
  return {
    id: petition.id,
    slug: petition.slug,
    title: petition.title,
    version: petition.version,
    bodyMarkdown: petition.bodyMarkdown,
    goalCount: petition.goalCount,
    isLive: petition.isLive,
    heroImages: petition.heroImages as HeroImage[],
    createdAt: petition.createdAt,
    updatedAt: petition.updatedAt,
  };
}

export async function getFirstPetition(): Promise<PetitionData | null> {
  const petition = await prisma.petition.findFirst({
    orderBy: { createdAt: 'asc' },
  });
  
  if (!petition) {
    return null;
  }
  
  return {
    id: petition.id,
    slug: petition.slug,
    title: petition.title,
    version: petition.version,
    bodyMarkdown: petition.bodyMarkdown,
    goalCount: petition.goalCount,
    isLive: petition.isLive,
    heroImages: petition.heroImages as HeroImage[],
    createdAt: petition.createdAt,
    updatedAt: petition.updatedAt,
  };
}

export async function updatePetition(id: string, data: Partial<Omit<PetitionData, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PetitionData> {
  const petition = await prisma.petition.update({
    where: { id },
    data: {
      ...data,
      heroImages: data.heroImages ? JSON.stringify(data.heroImages) : undefined,
    },
  });
  
  return {
    id: petition.id,
    slug: petition.slug,
    title: petition.title,
    version: petition.version,
    bodyMarkdown: petition.bodyMarkdown,
    goalCount: petition.goalCount,
    isLive: petition.isLive,
    heroImages: petition.heroImages as HeroImage[],
    createdAt: petition.createdAt,
    updatedAt: petition.updatedAt,
  };
}

export async function createPetition(data: Omit<PetitionData, 'id' | 'createdAt' | 'updatedAt'>): Promise<PetitionData> {
  const petition = await prisma.petition.create({
    data: {
      ...data,
      heroImages: JSON.stringify(data.heroImages),
    },
  });
  
  return {
    id: petition.id,
    slug: petition.slug,
    title: petition.title,
    version: petition.version,
    bodyMarkdown: petition.bodyMarkdown,
    goalCount: petition.goalCount,
    isLive: petition.isLive,
    heroImages: petition.heroImages as HeroImage[],
    createdAt: petition.createdAt,
    updatedAt: petition.updatedAt,
  };
}

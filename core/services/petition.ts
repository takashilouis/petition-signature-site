import { findPetitionBySlug, getFirstPetition, updatePetition } from '../repos/petitionRepo';
import { getBranding, getContactInfo, getFormHelpText } from '../repos/settingsRepo';
import type { PetitionData, HeroImage } from '../types';

export async function getCurrentPetition(): Promise<PetitionData | null> {
  // For now, we'll assume there's one main petition
  // In the future, this could be configurable or route-based
  return getFirstPetition();
}

export async function getPetitionBySlug(slug: string): Promise<PetitionData | null> {
  return findPetitionBySlug(slug);
}

export async function getPublicPetitionData(): Promise<{
  title: string;
  version: string;
  bodyMarkdown: string;
  heroImages: HeroImage[];
  isLive: boolean;
  goal: number;
} | null> {
  const petition = await getCurrentPetition();
  
  if (!petition) {
    return null;
  }
  
  return {
    title: petition.title,
    version: petition.version,
    bodyMarkdown: petition.bodyMarkdown,
    heroImages: petition.heroImages,
    isLive: petition.isLive,
    goal: petition.goalCount,
  };
}

export async function getPublicConfig(): Promise<{
  commentsEnabled: boolean;
  showRecent: boolean;
}> {
  // These could be stored in the database as settings
  // For now, we'll return defaults that can be configured via environment or database
  return {
    commentsEnabled: true,
    showRecent: true,
  };
}

export async function updatePetitionData(
  petitionId: string,
  data: Partial<Omit<PetitionData, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<PetitionData> {
  return updatePetition(petitionId, data);
}

export async function updateSliderImages(petitionId: string, heroImages: HeroImage[]): Promise<void> {
  await updatePetition(petitionId, { heroImages });
}

export async function addSliderImage(petitionId: string, image: HeroImage): Promise<HeroImage[]> {
  const petition = await getCurrentPetition();
  if (!petition) {
    throw new Error('No petition found');
  }
  
  const existingImages = petition.heroImages || [];
  const newImages = [...existingImages, image].sort((a, b) => a.order - b.order);
  
  await updatePetition(petitionId, { heroImages: newImages });
  return newImages;
}

export async function removeSliderImage(petitionId: string, imageId: string): Promise<HeroImage[]> {
  const petition = await getCurrentPetition();
  if (!petition) {
    throw new Error('No petition found');
  }
  
  const existingImages = petition.heroImages || [];
  const newImages = existingImages.filter(img => img.id !== imageId);
  
  await updatePetition(petitionId, { heroImages: newImages });
  return newImages;
}

export async function reorderSliderImages(
  petitionId: string,
  order: Array<{ id: string; order: number }>
): Promise<HeroImage[]> {
  const petition = await getCurrentPetition();
  if (!petition) {
    throw new Error('No petition found');
  }
  
  const existingImages = petition.heroImages || [];
  const orderMap = Object.fromEntries(order.map(item => [item.id, item.order]));
  
  const reorderedImages = existingImages
    .map(img => ({
      ...img,
      order: orderMap[img.id] ?? img.order,
    }))
    .sort((a, b) => a.order - b.order);
  
  await updatePetition(petitionId, { heroImages: reorderedImages });
  return reorderedImages;
}

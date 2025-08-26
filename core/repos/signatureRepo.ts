import { prisma } from '../../lib/prisma';
import type { SignatureData, SignatureFilters, SignatureAggregates, StatsData } from '../types';

export async function createSignature(data: Omit<SignatureData, 'id' | 'createdAt'>): Promise<SignatureData> {
  const signature = await prisma.signature.create({
    data: {
      petitionId: data.petitionId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
      comment: data.comment,
      consent: data.consent,
      method: data.method,
      signatureImage: data.signatureImage,
      typedSignature: data.typedSignature,
      petitionHash: data.petitionHash,
      signatureImageHash: data.signatureImageHash,
      auditHash: data.auditHash,
      ip: data.ip,
      userAgent: data.userAgent,
      emailVerifiedAt: data.emailVerifiedAt,
      receiptPdf: data.receiptPdf,
      receiptPdfMime: data.receiptPdfMime,
    },
  });
  
  return {
    id: signature.id,
    petitionId: signature.petitionId,
    firstName: signature.firstName,
    lastName: signature.lastName,
    email: signature.email,
    city: signature.city,
    state: signature.state,
    zip: signature.zip,
    country: signature.country,
    comment: signature.comment,
    consent: signature.consent,
    method: signature.method as 'drawn' | 'typed',
    signatureImage: signature.signatureImage,
    typedSignature: signature.typedSignature,
    petitionHash: signature.petitionHash,
    signatureImageHash: signature.signatureImageHash,
    auditHash: signature.auditHash,
    ip: signature.ip,
    userAgent: signature.userAgent,
    emailVerifiedAt: signature.emailVerifiedAt,
    createdAt: signature.createdAt,
    receiptPdf: signature.receiptPdf,
    receiptPdfMime: signature.receiptPdfMime,
  };
}

export async function findSignatureByAuditHash(auditHash: string): Promise<SignatureData | null> {
  const signature = await prisma.signature.findUnique({
    where: { auditHash },
    include: { petition: true },
  });
  
  if (!signature) {
    return null;
  }
  
  return {
    id: signature.id,
    petitionId: signature.petitionId,
    firstName: signature.firstName,
    lastName: signature.lastName,
    email: signature.email,
    city: signature.city,
    state: signature.state,
    zip: signature.zip,
    country: signature.country,
    comment: signature.comment,
    consent: signature.consent,
    method: signature.method as 'drawn' | 'typed',
    signatureImage: signature.signatureImage,
    typedSignature: signature.typedSignature,
    petitionHash: signature.petitionHash,
    signatureImageHash: signature.signatureImageHash,
    auditHash: signature.auditHash,
    ip: signature.ip,
    userAgent: signature.userAgent,
    emailVerifiedAt: signature.emailVerifiedAt,
    createdAt: signature.createdAt,
    receiptPdf: signature.receiptPdf,
    receiptPdfMime: signature.receiptPdfMime,
  };
}

export async function findSignatureById(id: string): Promise<SignatureData | null> {
  const signature = await prisma.signature.findUnique({
    where: { id },
  });
  
  if (!signature) {
    return null;
  }
  
  return {
    id: signature.id,
    petitionId: signature.petitionId,
    firstName: signature.firstName,
    lastName: signature.lastName,
    email: signature.email,
    city: signature.city,
    state: signature.state,
    zip: signature.zip,
    country: signature.country,
    comment: signature.comment,
    consent: signature.consent,
    method: signature.method as 'drawn' | 'typed',
    signatureImage: signature.signatureImage,
    typedSignature: signature.typedSignature,
    petitionHash: signature.petitionHash,
    signatureImageHash: signature.signatureImageHash,
    auditHash: signature.auditHash,
    ip: signature.ip,
    userAgent: signature.userAgent,
    emailVerifiedAt: signature.emailVerifiedAt,
    createdAt: signature.createdAt,
    receiptPdf: signature.receiptPdf,
    receiptPdfMime: signature.receiptPdfMime,
  };
}

export async function checkExistingSignature(email: string, petitionId: string): Promise<boolean> {
  const existing = await prisma.signature.findFirst({
    where: {
      email,
      petitionId,
    },
  });
  
  return !!existing;
}

export async function getSignatureStats(petitionId?: string): Promise<StatsData> {
  const whereClause = petitionId ? { petitionId } : {};
  
  // Get total count and goal
  const [count, petition] = await Promise.all([
    prisma.signature.count({ where: whereClause }),
    petitionId ? prisma.petition.findUnique({ where: { id: petitionId } }) : prisma.petition.findFirst(),
  ]);
  
  const goal = petition?.goalCount || 1000;
  
  // Get recent signatures
  const recentSignatures = await prisma.signature.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      firstName: true,
      lastName: true,
      state: true,
    },
  });
  
  const recent = recentSignatures.map(sig => ({
    first: sig.firstName,
    lastInitial: `${sig.lastName.charAt(0)}.`,
    state: sig.state,
  }));
  
  // Get signatures by state
  const byStateRaw = await prisma.signature.groupBy({
    by: ['state'],
    where: {
      ...whereClause,
      state: { not: null },
    },
    _count: { state: true },
  });
  
  const byState: Record<string, number> = {};
  byStateRaw.forEach(item => {
    if (item.state) {
      byState[item.state] = item._count.state;
    }
  });
  
  return {
    count,
    goal,
    recent,
    byState,
  };
}

export async function listSignatures(filters: SignatureFilters): Promise<{ items: Array<Omit<SignatureData, 'signatureImage' | 'receiptPdf'>>; total: number }> {
  const {
    city,
    state,
    country,
    from,
    to,
    q,
    page = 1,
    size = 25,
  } = filters;
  
  const where: any = {};
  
  if (city) {
    where.city = { contains: city, mode: 'insensitive' };
  }
  
  if (state) {
    where.state = { contains: state, mode: 'insensitive' };
  }
  
  if (country) {
    where.country = { contains: country, mode: 'insensitive' };
  }
  
  if (from || to) {
    where.createdAt = {};
    if (from) {
      where.createdAt.gte = new Date(from);
    }
    if (to) {
      where.createdAt.lte = new Date(to);
    }
  }
  
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: 'insensitive' } },
      { lastName: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { comment: { contains: q, mode: 'insensitive' } },
    ];
  }
  
  const [signatures, total] = await Promise.all([
    prisma.signature.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * size,
      take: size,
      select: {
        id: true,
        petitionId: true,
        firstName: true,
        lastName: true,
        email: true,
        city: true,
        state: true,
        zip: true,
        country: true,
        comment: true,
        consent: true,
        method: true,
        typedSignature: true,
        petitionHash: true,
        signatureImageHash: true,
        auditHash: true,
        ip: true,
        userAgent: true,
        emailVerifiedAt: true,
        createdAt: true,
        receiptPdfMime: true,
      },
    }),
    prisma.signature.count({ where }),
  ]);
  
  const items = signatures.map(sig => ({
    id: sig.id,
    petitionId: sig.petitionId,
    firstName: sig.firstName,
    lastName: sig.lastName,
    email: sig.email,
    city: sig.city,
    state: sig.state,
    zip: sig.zip,
    country: sig.country,
    comment: sig.comment,
    consent: sig.consent,
    method: sig.method as 'drawn' | 'typed',
    typedSignature: sig.typedSignature,
    petitionHash: sig.petitionHash,
    signatureImageHash: sig.signatureImageHash,
    auditHash: sig.auditHash,
    ip: sig.ip,
    userAgent: sig.userAgent,
    emailVerifiedAt: sig.emailVerifiedAt,
    createdAt: sig.createdAt,
    receiptPdfMime: sig.receiptPdfMime,
  }));
  
  return { items, total };
}

export async function getSignatureAggregates(filters: Omit<SignatureFilters, 'page' | 'size'>): Promise<SignatureAggregates> {
  const { city, state, country, from, to, q } = filters;
  
  const where: any = {};
  
  if (city) {
    where.city = { contains: city, mode: 'insensitive' };
  }
  
  if (state) {
    where.state = { contains: state, mode: 'insensitive' };
  }
  
  if (country) {
    where.country = { contains: country, mode: 'insensitive' };
  }
  
  if (from || to) {
    where.createdAt = {};
    if (from) {
      where.createdAt.gte = new Date(from);
    }
    if (to) {
      where.createdAt.lte = new Date(to);
    }
  }
  
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: 'insensitive' } },
      { lastName: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { comment: { contains: q, mode: 'insensitive' } },
    ];
  }
  
  const [byCityRaw, byStateRaw, byCountryRaw] = await Promise.all([
    prisma.signature.groupBy({
      by: ['city'],
      where: { ...where, city: { not: null } },
      _count: { city: true },
      orderBy: { _count: { city: 'desc' } },
      take: 10,
    }),
    prisma.signature.groupBy({
      by: ['state'],
      where: { ...where, state: { not: null } },
      _count: { state: true },
      orderBy: { _count: { state: 'desc' } },
      take: 10,
    }),
    prisma.signature.groupBy({
      by: ['country'],
      where: { ...where, country: { not: null } },
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 10,
    }),
  ]);
  
  return {
    byCity: byCityRaw.map(item => ({ key: item.city || '', count: item._count.city })),
    byState: byStateRaw.map(item => ({ key: item.state || '', count: item._count.state })),
    byCountry: byCountryRaw.map(item => ({ key: item.country || '', count: item._count.country })),
  };
}

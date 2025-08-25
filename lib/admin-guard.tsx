'use client';

import { ReactNode } from 'react';

export function useAdminAuth() {
  // Temporarily bypass authentication - always return authenticated
  return { 
    isAuthenticated: true, 
    isLoading: false 
  };
}

export function AdminGuard({ children }: { children: ReactNode }) {
  // Temporarily bypass all authentication checks
  return <>{children}</>;
}
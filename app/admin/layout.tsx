'use client';

import { AdminGuard } from '@/lib/admin-guard';
import { AdminShell } from '@/components/admin/AdminShell';
import { Toaster } from '@/components/ui/toaster';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminShell>
        {children}
      </AdminShell>
      <Toaster />
    </AdminGuard>
  );
}
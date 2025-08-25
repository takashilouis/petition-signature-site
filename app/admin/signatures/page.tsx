'use client';

import { useEffect, useState, useCallback } from 'react';
import { SignatureFilters } from '@/components/admin/SignatureFilters';
import { SignatureTable } from '@/components/admin/SignatureTable';
import { CountsGrid } from '@/components/admin/CountsGrid';
import { useToast } from '@/hooks/use-toast';
import { useAdminApi } from '@/lib/api';
import type { SignatureRow, SignatureAggregates } from '@/types/admin';

interface FilterState {
  city: string;
  state: string;
  country: string;
  from: string;
  to: string;
  page: number;
  size: number;
}

export default function SignaturesPage() {
  const [signatures, setSignatures] = useState<SignatureRow[]>([]);
  const [aggregates, setAggregates] = useState<SignatureAggregates | null>(null);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    city: '',
    state: '',
    country: '',
    from: '',
    to: '',
    page: 1,
    size: 25,
  });
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const api = await useAdminApi();
      const [signaturesData, aggregatesData] = await Promise.all([
        api.listSignatures(params),
        api.getAggregates(params),
      ]);

      setSignatures(signaturesData.items);
      setTotal(signaturesData.total);
      setAggregates(aggregatesData);
    } catch (error) {
      console.error('Failed to fetch signatures:', error);
      toast({
        title: 'Error',
        description: 'Failed to load signatures.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1, // Reset to page 1 unless explicitly setting page
    }));
  }, []);

  const handleExport = useCallback(async () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'page' && key !== 'size') {
        params.append(key, value.toString());
      }
    });

    const api = await useAdminApi();
    const exportUrl = api.exportCsvUrl(params);
    window.open(exportUrl, '_blank');
  }, [filters]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Signatures</h1>
        <p className="text-gray-600">Browse and export petition signatures</p>
      </div>

      <SignatureFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onExport={handleExport}
        total={total}
      />

      {aggregates && (
        <CountsGrid aggregates={aggregates} />
      )}

      <SignatureTable
        signatures={signatures}
        total={total}
        page={filters.page}
        pageSize={filters.size}
        onPageChange={(page) => handleFilterChange({ page })}
        onPageSizeChange={(size) => handleFilterChange({ size, page: 1 })}
        isLoading={isLoading}
      />
    </div>
  );
}
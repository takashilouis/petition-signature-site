'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormActions } from '@/components/admin/FormActions';
import { useToast } from '@/hooks/use-toast';
import { brandingSchema, type BrandingForm } from '@/lib/admin-schemas';
import { useAdminApi } from '@/lib/api';
import type { Branding } from '@/types/admin';

export default function BrandingPage() {
  const [originalData, setOriginalData] = useState<Branding | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<BrandingForm>({
    resolver: zodResolver(brandingSchema),
  });

  const watchedValues = watch();

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const api = await useAdminApi();
        const data = await api.getBranding();
        setOriginalData(data);
        reset(data);
      } catch (error) {
        console.error('Failed to fetch branding:', error);
        toast({
          title: 'Error',
          description: 'Failed to load branding data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranding();
  }, [reset, toast]);

  const onSubmit = async (data: BrandingForm) => {
    setIsSaving(true);
    try {
      const api = await useAdminApi();
      await api.putBranding(data);
      setOriginalData(data);
      reset(data);
      toast({
        title: 'Success',
        description: 'Branding updated successfully.',
      });
    } catch (error) {
      console.error('Failed to save branding:', error);
      toast({
        title: 'Error',
        description: 'Failed to save branding changes.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevert = () => {
    if (originalData) {
      reset(originalData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Branding</h1>
        <p className="text-gray-600">Customize your site's title and branding</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Edit Branding</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="siteTitleLine1">Site Title - Line 1</Label>
                <Input
                  id="siteTitleLine1"
                  {...register('siteTitleLine1')}
                  className={errors.siteTitleLine1 ? 'border-red-500' : ''}
                />
                {errors.siteTitleLine1 && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.siteTitleLine1.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="siteTitleLine2">Site Title - Line 2</Label>
                <Input
                  id="siteTitleLine2"
                  {...register('siteTitleLine2')}
                  className={errors.siteTitleLine2 ? 'border-red-500' : ''}
                />
                {errors.siteTitleLine2 && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.siteTitleLine2.message}
                  </p>
                )}
              </div>

              <div className="pt-4">
                <FormActions
                  onSave={handleSubmit(onSubmit)}
                  onRevert={handleRevert}
                  isSaving={isSaving}
                  hasChanges={isDirty}
                />
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between h-16 px-4 border-b">
                <div className="text-xl font-bold text-gray-900">
                  <div>{watchedValues.siteTitleLine1 || 'Site Title Line 1'}</div>
                  <div className="text-sm font-medium text-gray-600">
                    {watchedValues.siteTitleLine2 || 'Site Title Line 2'}
                  </div>
                </div>
                <div className="text-sm text-gray-500">Header Preview</div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This is how your site title will appear in the header
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormActions } from '@/components/admin/FormActions';
import { useToast } from '@/hooks/use-toast';
import { formHelpTextSchema, type FormHelpTextForm } from '@/lib/admin-schemas';
import { useAdminApi } from '@/lib/api';
import type { FormHelpText } from '@/types/admin';

export default function FormCopyPage() {
  const [originalData, setOriginalData] = useState<FormHelpText | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<FormHelpTextForm>({
    resolver: zodResolver(formHelpTextSchema),
  });

  const watchedValues = watch();

  useEffect(() => {
    const fetchFormHelp = async () => {
      try {
        const api = await useAdminApi();
        const data = await api.getFormHelp();
        setOriginalData(data);
        reset(data);
      } catch (error) {
        console.error('Failed to fetch form help text:', error);
        toast({
          title: 'Error',
          description: 'Failed to load form help text.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormHelp();
  }, [reset, toast]);

  const onSubmit = async (data: FormHelpTextForm) => {
    setIsSaving(true);
    try {
      const api = await useAdminApi();
      await api.putFormHelp(data);
      setOriginalData(data);
      reset(data);
      toast({
        title: 'Success',
        description: 'Form help text updated successfully.',
      });
    } catch (error) {
      console.error('Failed to save form help text:', error);
      toast({
        title: 'Error',
        description: 'Failed to save form help text.',
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
        <h1 className="text-2xl font-bold text-gray-900">Form Copy</h1>
        <p className="text-gray-600">Edit the explanatory text shown on the petition form</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Edit Help Text</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="whyLine1">Why Line 1</Label>
                <Input
                  id="whyLine1"
                  {...register('whyLine1')}
                  className={errors.whyLine1 ? 'border-red-500' : ''}
                  placeholder="First reason to sign the petition"
                />
                {errors.whyLine1 && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.whyLine1.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="whyLine2">Why Line 2</Label>
                <Input
                  id="whyLine2"
                  {...register('whyLine2')}
                  className={errors.whyLine2 ? 'border-red-500' : ''}
                  placeholder="Second reason to sign the petition"
                />
                {errors.whyLine2 && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.whyLine2.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="whyLine3">Why Line 3</Label>
                <Input
                  id="whyLine3"
                  {...register('whyLine3')}
                  className={errors.whyLine3 ? 'border-red-500' : ''}
                  placeholder="Third reason to sign the petition"
                />
                {errors.whyLine3 && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.whyLine3.message}
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
              <h3 className="font-semibold text-gray-900 mb-3">Why Sign This Petition?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {watchedValues.whyLine1 || 'First reason will appear here'}
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {watchedValues.whyLine2 || 'Second reason will appear here'}
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {watchedValues.whyLine3 || 'Third reason will appear here'}
                </li>
              </ul>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This text will appear above the signature step on the petition form
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
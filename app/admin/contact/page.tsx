'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormActions } from '@/components/admin/FormActions';
import { useToast } from '@/hooks/use-toast';
import { contactSchema, type ContactForm } from '@/lib/admin-schemas';
import { useAdminApi } from '@/lib/api';
import type { ContactInfo } from '@/types/admin';

export default function ContactPage() {
  const [originalData, setOriginalData] = useState<ContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const api = await useAdminApi();
        const data = await api.getContact();
        setOriginalData(data);
        reset({
          ...data,
          socialLinks: {
            x: data.socialLinks?.x || '',
            facebook: data.socialLinks?.facebook || '',
            instagram: data.socialLinks?.instagram || '',
          },
        });
      } catch (error) {
        console.error('Failed to fetch contact info:', error);
        toast({
          title: 'Error',
          description: 'Failed to load contact information.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContact();
  }, [reset, toast]);

  const onSubmit = async (data: ContactForm) => {
    setIsSaving(true);
    try {
      // Clean up empty social links
      const cleanedData = {
        ...data,
        socialLinks: {
          x: data.socialLinks?.x || undefined,
          facebook: data.socialLinks?.facebook || undefined,
          instagram: data.socialLinks?.instagram || undefined,
        },
      };

      const api = await useAdminApi();
      await api.putContact(cleanedData);
      setOriginalData(cleanedData);
      reset(cleanedData);
      toast({
        title: 'Success',
        description: 'Contact information updated successfully.',
      });
    } catch (error) {
      console.error('Failed to save contact info:', error);
      toast({
        title: 'Error',
        description: 'Failed to save contact information.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevert = () => {
    if (originalData) {
      reset({
        ...originalData,
        socialLinks: {
          x: originalData.socialLinks?.x || '',
          facebook: originalData.socialLinks?.facebook || '',
          instagram: originalData.socialLinks?.instagram || '',
        },
      });
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
        <h1 className="text-2xl font-bold text-gray-900">Contact Information</h1>
        <p className="text-gray-600">Manage your organization's contact details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="contactEmail">Email Address *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  {...register('contactEmail')}
                  className={errors.contactEmail ? 'border-red-500' : ''}
                />
                {errors.contactEmail && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.contactEmail.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="contactPhone">Phone Number</Label>
                <Input
                  id="contactPhone"
                  {...register('contactPhone')}
                  className={errors.contactPhone ? 'border-red-500' : ''}
                />
                {errors.contactPhone && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.contactPhone.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                {...register('address')}
                rows={3}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Links</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="x">X (Twitter)</Label>
                  <Input
                    id="x"
                    type="url"
                    placeholder="https://x.com/username"
                    {...register('socialLinks.x')}
                    className={errors.socialLinks?.x ? 'border-red-500' : ''}
                  />
                  {errors.socialLinks?.x && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.socialLinks.x.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    type="url"
                    placeholder="https://facebook.com/page"
                    {...register('socialLinks.facebook')}
                    className={errors.socialLinks?.facebook ? 'border-red-500' : ''}
                  />
                  {errors.socialLinks?.facebook && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.socialLinks.facebook.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    type="url"
                    placeholder="https://instagram.com/username"
                    {...register('socialLinks.instagram')}
                    className={errors.socialLinks?.instagram ? 'border-red-500' : ''}
                  />
                  {errors.socialLinks?.instagram && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.socialLinks.instagram.message}
                    </p>
                  )}
                </div>
              </div>
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
    </div>
  );
}
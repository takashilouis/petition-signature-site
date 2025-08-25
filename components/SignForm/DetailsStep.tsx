'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { detailsStepSchema, type DetailsStepForm, US_STATES } from '@/lib/schemas';

interface DetailsStepProps {
  onSubmit: (data: DetailsStepForm) => Promise<void>;
  isLoading: boolean;
  commentsEnabled: boolean;
}

export function DetailsStep({ onSubmit, isLoading, commentsEnabled }: DetailsStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DetailsStepForm>({
    resolver: zodResolver(detailsStepSchema),
    defaultValues: {
      consent: false,
    },
  });

  const consent = watch('consent');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p id="firstName-error" className="text-sm text-red-600 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p id="lastName-error" className="text-sm text-red-600 mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register('city')}
                aria-describedby={errors.city ? 'city-error' : undefined}
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && (
                <p id="city-error" className="text-sm text-red-600 mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="state">State *</Label>
              <Select onValueChange={(value) => setValue('state', value)}>
                <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="zip">ZIP Code *</Label>
              <Input
                id="zip"
                {...register('zip')}
                aria-describedby={errors.zip ? 'zip-error' : undefined}
                className={errors.zip ? 'border-red-500' : ''}
              />
              {errors.zip && (
                <p id="zip-error" className="text-sm text-red-600 mt-1">
                  {errors.zip.message}
                </p>
              )}
            </div>
          </div>

          {commentsEnabled && (
            <div>
              <Label htmlFor="comment">Comment (Optional)</Label>
              <Textarea
                id="comment"
                {...register('comment')}
                placeholder="Share why this petition matters to you..."
                rows={3}
                aria-describedby={errors.comment ? 'comment-error' : undefined}
                className={errors.comment ? 'border-red-500' : ''}
              />
              {errors.comment && (
                <p id="comment-error" className="text-sm text-red-600 mt-1">
                  {errors.comment.message}
                </p>
              )}
            </div>
          )}

          <div className="flex items-start space-x-2">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setValue('consent', !!checked)}
              aria-describedby={errors.consent ? 'consent-error' : undefined}
              className={errors.consent ? 'border-red-500' : ''}
            />
            <Label 
              htmlFor="consent" 
              className="text-sm leading-relaxed cursor-pointer"
            >
              I agree this is my electronic signature and I intend to sign this petition
            </Label>
          </div>
          {errors.consent && (
            <p id="consent-error" className="text-sm text-red-600">
              {errors.consent.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending verification code...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
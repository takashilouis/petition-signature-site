'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { SignaturePad, type SignaturePadRef } from '@/components/SignaturePad';
import { TypedSignature } from '@/components/TypedSignature';
import { ConsentBox } from '@/components/ConsentBox';
import { signatureSchema, type SignatureForm } from '@/lib/schemas';
import type { DetailsStepForm } from '@/lib/schemas';

interface SignatureStepProps {
  detailsData: DetailsStepForm;
  petitionTitle: string;
  petitionVersion: string;
  onSubmit: (data: SignatureForm) => Promise<void>;
  isLoading: boolean;
}

export function SignatureStep({ 
  detailsData, 
  petitionTitle, 
  petitionVersion, 
  onSubmit, 
  isLoading 
}: SignatureStepProps) {
  const [signatureMethod, setSignatureMethod] = useState<'drawn' | 'typed'>('drawn');
  const [typedName, setTypedName] = useState('');
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const signaturePadRef = useRef<SignaturePadRef>(null);

  const {
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignatureForm>({
    resolver: zodResolver(signatureSchema),
  });

  const fullName = `${detailsData.firstName} ${detailsData.lastName}`;

  const handleFormSubmit = async () => {
    try {
      if (signatureMethod === 'drawn') {
        const signatureData = signaturePadRef.current?.getPngData();
        if (!signatureData) {
          setError('signatureImageBase64', { message: 'Please draw your signature' });
          return;
        }
        await onSubmit({
          method: 'drawn',
          signatureImageBase64: signatureData,
        });
      } else {
        const signature = typedName || fullName;
        if (!signature.trim()) {
          setError('typedSignature', { message: 'Please enter your name' });
          return;
        }
        await onSubmit({
          method: 'typed',
          typedSignature: signature,
        });
      }
    } catch (error) {
      console.error('Signature submission failed:', error);
    }
  };

  const isSignatureValid = signatureMethod === 'drawn' 
    ? hasDrawnSignature 
    : (typedName || fullName).trim().length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Signature</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <RadioGroup
            value={signatureMethod}
            onValueChange={(value) => setSignatureMethod(value as 'drawn' | 'typed')}
            className="mb-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="drawn" id="drawn" />
              <Label htmlFor="drawn">Draw my signature</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="typed" id="typed" />
              <Label htmlFor="typed">Type my name</Label>
            </div>
          </RadioGroup>

          {signatureMethod === 'drawn' ? (
            <div className="space-y-4">
              <SignaturePad
                ref={signaturePadRef}
                onSignatureChange={setHasDrawnSignature}
              />
              {errors.signatureImageBase64 && (
                <p className="text-sm text-red-600">
                  {errors.signatureImageBase64.message}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="typedName">
                  Your Name (leave blank to use "{fullName}")
                </Label>
                <Input
                  id="typedName"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder={fullName}
                />
              </div>
              <TypedSignature name={typedName || fullName} />
              {errors.typedSignature && (
                <p className="text-sm text-red-600">
                  {errors.typedSignature.message}
                </p>
              )}
            </div>
          )}

          <div className="mt-6">
            <ConsentBox 
              petitionTitle={petitionTitle} 
              petitionVersion={petitionVersion} 
            />
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Your signature will be stored with an email-verified timestamp
          </p>

          <Button
            type="submit"
            className="w-full mt-6"
            disabled={isLoading || !isSignatureValid}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting signature...
              </>
            ) : (
              'Sign and Submit'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, Shield } from 'lucide-react';
import { useAnalytics } from '@/lib/analytics';
import { useApi } from '@/lib/api';
import { mockApi } from '@/lib/mock';

interface VerifyForm {
  auditHash: string;
}

export default function VerifyPage() {
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { logEvent } = useAnalytics();
  const api = process.env.NEXT_PUBLIC_USE_MOCKS === 'true' ? mockApi : useApi();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyForm>();

  const onSubmit = async (data: VerifyForm) => {
    setIsLoading(true);
    setVerificationResult(null);
    
    try {
      const result = await api.verifySignature(data.auditHash);
      setVerificationResult(result);
      logEvent('signature_verified', { 
        valid: result.valid,
        hash: data.auditHash 
      });
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationResult({
        valid: false,
        message: 'Verification failed. Please check your audit hash and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Verify Signature
          </h1>
          <p className="text-lg text-gray-600">
            Enter an audit hash to verify that a signature was properly recorded.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Signature Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="auditHash">Audit Hash</Label>
                <Input
                  id="auditHash"
                  {...register('auditHash', { 
                    required: 'Audit hash is required',
                    minLength: { value: 10, message: 'Invalid audit hash format' }
                  })}
                  placeholder="Enter the audit hash from your receipt"
                  className={errors.auditHash ? 'border-red-500' : ''}
                />
                {errors.auditHash && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.auditHash.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Signature'
                )}
              </Button>
            </form>

            {verificationResult && (
              <Alert className={`mt-6 ${verificationResult.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-center gap-2">
                  {verificationResult.valid ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <AlertDescription className={verificationResult.valid ? 'text-green-800' : 'text-red-800'}>
                    {verificationResult.message}
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Each signature is assigned a unique audit hash for verification and transparency.
          </p>
        </div>
      </div>
    </div>
  );
}
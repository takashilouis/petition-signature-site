'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MarkdownContent } from '@/components/MarkdownContent';
import { DetailsStep } from '@/components/SignForm/DetailsStep';
import { OtpDialog } from '@/components/SignForm/OtpDialog';
import { SignatureStep } from '@/components/SignForm/SignatureStep';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/lib/analytics';
import { useApi } from '@/lib/api';
import { mockApi } from '@/lib/mock';
import type { PetitionData, ConfigData, DetailsStepForm, SignatureForm } from '@/lib/schemas';

export default function PetitionPage() {
  const [petition, setPetition] = useState<PetitionData | null>(null);
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [step, setStep] = useState<'details' | 'signature'>('details');
  const [detailsData, setDetailsData] = useState<DetailsStepForm | null>(null);
  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  
  const router = useRouter();
  const { toast } = useToast();
  const { logEvent } = useAnalytics();
  const api = process.env.NEXT_PUBLIC_USE_MOCKS === 'true' ? mockApi : useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petitionData, configData] = await Promise.all([
          api.getPetition(),
          api.getConfig(),
        ]);
        setPetition(petitionData);
        setConfig(configData);
        logEvent('petition_viewed');
      } catch (error) {
        console.error('Failed to fetch petition data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load petition data. Please try again.',
          variant: 'destructive',
        });
      }
    };

    fetchData();
  }, [api, logEvent, toast]);

  const handleDetailsSubmit = async (data: DetailsStepForm) => {
    setIsLoading(true);
    setCurrentEmail(data.email);
    
    try {
      const response = await api.requestOtp(data.email);
      if (response.ok) {
        setDetailsData(data);
        setShowOtpDialog(true);
        logEvent('otp_requested', { email: data.email });
      } else {
        throw new Error('Failed to send verification code');
      }
    } catch (error) {
      console.error('OTP request failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to send verification code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (code: string): Promise<boolean> => {
    setIsVerifying(true);
    
    try {
      const response = await api.verifyOtp(currentEmail, code);
      if (response.ok) {
        setToken(response.token);
        setShowOtpDialog(false);
        setStep('signature');
        logEvent('email_verified');
        return true;
      } else {
        logEvent('otp_verification_failed');
        return false;
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpResend = async () => {
    setIsResending(true);
    
    try {
      await api.requestOtp(currentEmail);
      toast({
        title: 'Code Sent',
        description: 'A new verification code has been sent to your email.',
      });
      logEvent('otp_resent');
    } catch (error) {
      console.error('OTP resend failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to resend code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleSignatureSubmit = async (signatureData: SignatureForm) => {
    if (!detailsData || !token) return;

    setIsLoading(true);
    
    try {
      const payload = {
        ...detailsData,
        ...signatureData,
      };

      const response = await api.signPetition(token, payload);
      
      if (response.ok) {
        logEvent('petition_signed', { method: signatureData.method });
        const receiptParam = encodeURIComponent(response.receiptUrl);
        router.push(`/thank-you?receipt=${receiptParam}&audit=${response.auditHash}`);
      } else {
        throw new Error('Failed to submit signature');
      }
    } catch (error) {
      console.error('Signature submission failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit signature. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!petition || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!petition.isLive) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Petition Not Available
          </h1>
          <p className="text-gray-600">
            This petition is currently not accepting signatures.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Petition Content */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {petition.title}
              </h1>
              <Badge variant="secondary">v{petition.version}</Badge>
            </div>
          </div>
          
          <MarkdownContent content={petition.bodyMarkdown} />
        </div>

        {/* Right Column - Sign Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {step === 'details' ? (
              <DetailsStep
                onSubmit={handleDetailsSubmit}
                isLoading={isLoading}
                commentsEnabled={config.commentsEnabled}
              />
            ) : (
              detailsData && (
                <SignatureStep
                  detailsData={detailsData}
                  petitionTitle={petition.title}
                  petitionVersion={petition.version}
                  onSubmit={handleSignatureSubmit}
                  isLoading={isLoading}
                />
              )
            )}
          </div>
        </div>
      </div>

      <OtpDialog
        isOpen={showOtpDialog}
        email={currentEmail}
        onVerify={handleOtpVerify}
        onResend={handleOtpResend}
        isVerifying={isVerifying}
        isResending={isResending}
      />
    </div>
  );
}
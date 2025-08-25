'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail } from 'lucide-react';
import { otpSchema, type OtpForm } from '@/lib/schemas';

interface OtpDialogProps {
  isOpen: boolean;
  email: string;
  onVerify: (code: string) => Promise<boolean>;
  onResend: () => Promise<void>;
  isVerifying: boolean;
  isResending: boolean;
}

export function OtpDialog({ 
  isOpen, 
  email, 
  onVerify, 
  onResend, 
  isVerifying, 
  isResending 
}: OtpDialogProps) {
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [codes, setCodes] = useState(['', '', '', '', '', '']);

  const {
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
  });

  useEffect(() => {
    if (isOpen) {
      setCodes(['', '', '', '', '', '']);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCodes = [...codes];
    newCodes[index] = value.slice(-1);
    setCodes(newCodes);

    clearErrors();

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCodes.every(code => code !== '') && newCodes.join('').length === 6) {
      handleVerify(newCodes.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code: string) => {
    try {
      const success = await onVerify(code);
      if (!success) {
        setError('code', { message: 'Invalid verification code. Please try again.' });
        setCodes(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError('code', { message: 'Verification failed. Please try again.' });
    }
  };

  const handleResend = async () => {
    try {
      await onResend();
      setResendCooldown(30);
      setCodes(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error('Failed to resend code:', error);
    }
  };

  const onSubmit = ({ code }: OtpForm) => {
    handleVerify(code);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md" aria-describedby="otp-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Verify Your Email
          </DialogTitle>
        </DialogHeader>
        
        <div id="otp-description" className="space-y-4">
          <p className="text-sm text-gray-600">
            We've sent a 6-digit verification code to <strong>{email}</strong>. 
            Please enter it below to continue.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Verification Code</Label>
              <div className="flex gap-2 mt-2">
                {codes.map((code, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={code}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-mono"
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>
              {errors.code && (
                <p className="text-sm text-red-600 mt-2">
                  {errors.code.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isVerifying || codes.join('').length !== 6}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleResend}
                disabled={isResending || resendCooldown > 0}
                className="w-full"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  'Resend Code'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
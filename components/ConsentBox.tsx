import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface ConsentBoxProps {
  petitionTitle: string;
  petitionVersion: string;
}

export function ConsentBox({ petitionTitle, petitionVersion }: ConsentBoxProps) {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Electronic Signature Disclosure</p>
            <p className="leading-relaxed">
              By proceeding, you acknowledge that your electronic signature on "{petitionTitle}" 
              (version {petitionVersion}) will be legally binding and equivalent to a handwritten signature. 
              Your signature will be timestamped and stored securely with email verification.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
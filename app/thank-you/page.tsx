'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { ShareButtons } from '@/components/ShareButtons';
import { StatsWidget } from '@/components/StatsWidget';
import { useAnalytics } from '@/lib/analytics';
import { useApi } from '@/lib/api';
import { mockApi } from '@/lib/mock';
import type { StatsData, ConfigData } from '@/lib/api';

export default function ThankYouPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [config, setConfig] = useState<ConfigData | null>(null);
  const searchParams = useSearchParams();
  const receiptUrl = searchParams.get('receipt');
  const auditHash = searchParams.get('audit');
  const { logEvent } = useAnalytics();
  
  const api = process.env.NEXT_PUBLIC_USE_MOCKS === 'true' ? mockApi : useApi();

  useEffect(() => {
    logEvent('thank_you_viewed');
    
    const fetchStats = async () => {
      try {
        const [statsData, configData] = await Promise.all([
          api.getStats(),
          api.getConfig(),
        ]);
        setStats(statsData);
        setConfig(configData);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, [api, logEvent]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thank You for Signing!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your signature has been successfully recorded and verified. Together, we're making a difference.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Signature Confirmed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Your signature has been securely recorded with email verification and a timestamp.
              </p>
              
              {receiptUrl && (
                <Button asChild variant="outline" className="w-full">
                  <a 
                    href={receiptUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Receipt
                  </a>
                </Button>
              )}

              {auditHash && (
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Audit Hash:</p>
                  <code className="block bg-gray-100 p-2 rounded text-xs break-all">
                    {auditHash}
                  </code>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spread the Word</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Help us reach our goal by sharing this petition with your friends and family.
              </p>
              <ShareButtons 
                title="I just signed this important petition - join me!" 
              />
            </CardContent>
          </Card>
        </div>

        {stats && config && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Latest Activity
            </h2>
            <StatsWidget stats={stats} showRecent={config.showRecent} />
          </div>
        )}

        <div className="text-center mt-12">
          <Button asChild variant="outline">
            <Link href="/">
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StatsData } from '@/lib/api';

interface StatsWidgetProps {
  stats: StatsData;
  showRecent: boolean;
}

export function StatsWidget({ stats, showRecent }: StatsWidgetProps) {
  const topStates = Object.entries(stats.byState)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {showRecent && stats.recent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Signers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.recent.map((signer, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="font-medium">
                    {signer.first} {signer.lastInitial}.
                  </span>
                  {signer.state && (
                    <span className="text-gray-500">{signer.state}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top States</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topStates.map(([state, count]) => (
              <div key={state} className="flex justify-between items-center text-sm">
                <span className="font-medium">{state}</span>
                <span className="text-gray-500">{count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
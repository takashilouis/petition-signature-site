'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Flag, Globe } from 'lucide-react';
import type { SignatureAggregates } from '@/types/admin';

interface CountsGridProps {
  aggregates: SignatureAggregates;
}

export function CountsGrid({ aggregates }: CountsGridProps) {
  const renderCountList = (
    items: Array<{ key: string; count: number }>,
    title: string,
    icon: React.ReactNode
  ) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No data</p>
        ) : (
          <div className="space-y-2">
            {items.slice(0, 5).map((item) => (
              <div key={item.key} className="flex justify-between items-center text-sm">
                <span className="text-gray-700 truncate">{item.key}</span>
                <span className="font-medium text-gray-900 ml-2">
                  {item.count.toLocaleString()}
                </span>
              </div>
            ))}
            {items.length > 5 && (
              <p className="text-xs text-gray-500 pt-1">
                +{items.length - 5} more
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {renderCountList(
        aggregates.byCity,
        'By City',
        <MapPin className="h-4 w-4" />
      )}
      {renderCountList(
        aggregates.byState,
        'By State',
        <Flag className="h-4 w-4" />
      )}
      {renderCountList(
        aggregates.byCountry,
        'By Country',
        <Globe className="h-4 w-4" />
      )}
    </div>
  );
}
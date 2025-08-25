'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';

interface FilterState {
  city: string;
  state: string;
  country: string;
  from: string;
  to: string;
  page: number;
  size: number;
}

interface SignatureFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onExport: () => void;
  total: number;
}

export function SignatureFilters({ filters, onFilterChange, onExport, total }: SignatureFiltersProps) {
  const [localFilters, setLocalFilters] = useState({
    city: filters.city,
    state: filters.state,
    country: filters.country,
    from: filters.from,
    to: filters.to,
  });

  // Use ref to store the latest onFilterChange callback
  const onFilterChangeRef = useRef(onFilterChange);
  onFilterChangeRef.current = onFilterChange;

  // Debounce filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChangeRef.current(localFilters);
    }, 500);

    return () => clearTimeout(timer);
  }, [localFilters]);

  const handleInputChange = (field: string, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      city: '',
      state: '',
      country: '',
      from: '',
      to: '',
    };
    setLocalFilters(clearedFilters);
    onFilterChangeRef.current(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {total.toLocaleString()} signatures
            </span>
            <Button onClick={onExport} size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-5">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={localFilters.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Filter by city"
            />
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={localFilters.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="Filter by state"
            />
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={localFilters.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="Filter by country"
            />
          </div>

          <div>
            <Label htmlFor="from">From Date</Label>
            <Input
              id="from"
              type="date"
              value={localFilters.from}
              onChange={(e) => handleInputChange('from', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="to">To Date</Label>
            <Input
              id="to"
              type="date"
              value={localFilters.to}
              onChange={(e) => handleInputChange('to', e.target.value)}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
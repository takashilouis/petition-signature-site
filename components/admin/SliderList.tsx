'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical, Trash2, MoveUp, MoveDown } from 'lucide-react';
import type { SliderImage } from '@/types/admin';

interface SliderListProps {
  images: SliderImage[];
  onReorder: (newOrder: Array<{ id: string; order: number }>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function SliderList({ images, onReorder, onDelete }: SliderListProps) {
  const [isReordering, setIsReordering] = useState(false);

  const moveImage = async (index: number, direction: 'up' | 'down') => {
    if (isReordering) return;
    
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    
    // Swap the images
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    
    // Create new order array
    const newOrder = newImages.map((img, idx) => ({
      id: img.id,
      order: idx + 1,
    }));
    
    setIsReordering(true);
    try {
      await onReorder(newOrder);
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <div className="space-y-4">
      {images.map((image, index) => (
        <Card key={image.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveImage(index, 'up')}
                  disabled={index === 0 || isReordering}
                  className="h-6 w-6 p-0"
                >
                  <MoveUp className="h-3 w-3" />
                </Button>
                <GripVertical className="h-4 w-4 text-gray-400" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveImage(index, 'down')}
                  disabled={index === images.length - 1 || isReordering}
                  className="h-6 w-6 p-0"
                >
                  <MoveDown className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {image.alt}
                </p>
                <p className="text-xs text-gray-500">
                  Order: {image.order}
                </p>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:text-red-700"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
                    onDelete(image.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
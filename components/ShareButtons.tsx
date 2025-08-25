'use client';

import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Mail } from 'lucide-react';

interface ShareButtonsProps {
  title?: string;
  url?: string;
}

export function ShareButtons({ title = 'I just signed this important petition', url }: ShareButtonsProps) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.origin : '');
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=I thought you might be interested in this petition: ${encodedUrl}`,
  };

  const handleShare = (platform: string, url: string) => {
    if (platform === 'email') {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        variant="outline"
        onClick={() => handleShare('twitter', shareLinks.twitter)}
        className="flex items-center gap-2 hover:bg-blue-50"
      >
        <Twitter className="h-4 w-4" />
        Share on X
      </Button>
      
      <Button
        variant="outline"
        onClick={() => handleShare('facebook', shareLinks.facebook)}
        className="flex items-center gap-2 hover:bg-blue-50"
      >
        <Facebook className="h-4 w-4" />
        Share on Facebook
      </Button>
      
      <Button
        variant="outline"
        onClick={() => handleShare('email', shareLinks.email)}
        className="flex items-center gap-2 hover:bg-gray-50"
      >
        <Mail className="h-4 w-4" />
        Share via Email
      </Button>
    </div>
  );
}
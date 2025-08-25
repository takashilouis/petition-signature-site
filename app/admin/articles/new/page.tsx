'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArticleEditor } from '@/components/admin/ArticleEditor';
import { useToast } from '@/hooks/use-toast';
import { useAdminApi } from '@/lib/api';
import type { ArticleForm } from '@/lib/admin-schemas';

export default function NewArticlePage() {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSave = async (data: ArticleForm) => {
    setIsSaving(true);
    try {
      const api = await useAdminApi();
      await api.postArticle(data);
      toast({
        title: 'Success',
        description: 'Article created successfully.',
      });
      router.push('/admin/articles');
    } catch (error) {
      console.error('Failed to create article:', error);
      toast({
        title: 'Error',
        description: 'Failed to create article.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Article</h1>
        <p className="text-gray-600">Create a new article</p>
      </div>

      <ArticleEditor
        onSave={handleSave}
        isSaving={isSaving}
        isNew={true}
      />
    </div>
  );
}
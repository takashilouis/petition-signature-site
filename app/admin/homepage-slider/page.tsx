'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArticleEditor } from '@/components/admin/ArticleEditor';
import { useToast } from '@/hooks/use-toast';
import { useAdminApi } from '@/lib/api';
import type { Article } from '@/types/admin';
import type { ArticleForm } from '@/lib/admin-schemas';

interface EditArticlePageProps {
  params: { id: string };
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const api = await useAdminApi();
        const data = await api.getArticle(params.id);
        setArticle(data);
      } catch (error) {
        console.error('Failed to fetch article:', error);
        toast({
          title: 'Error',
          description: 'Failed to load article.',
          variant: 'destructive',
        });
        router.push('/admin/articles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [params.id, router, toast]);

  const handleSave = async (data: ArticleForm) => {
    setIsSaving(true);
    try {
      const api = await useAdminApi();
      toast({
        title: 'Success',
        description: 'Article updated successfully.',
      });
      router.push('/admin/articles');
    } catch (error) {
      console.error('Failed to update article:', error);
      toast({
        title: 'Error',
        description: 'Failed to update article.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Article not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
        <p className="text-gray-600">Update article details</p>
      </div>

      <ArticleEditor
        article={article}
        onSave={handleSave}
        isSaving={isSaving}
        isNew={false}
      />
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ArticleTable } from '@/components/admin/ArticleTable';
import { useToast } from '@/hooks/use-toast';
import { useAdminApi } from '@/lib/api';
import type { Article } from '@/types/admin';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const api = await useAdminApi();
      const data = await api.listArticles();
      setArticles(data);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load articles.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const api = await useAdminApi();
      await api.deleteArticle(id);
      await fetchArticles();
      toast({
        title: 'Success',
        description: 'Article deleted successfully.',
      });
    } catch (error) {
      console.error('Failed to delete article:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete article.',
        variant: 'destructive',
      });
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: 'draft' | 'published') => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    try {
      const api = await useAdminApi();
      await api.putArticle(id, { status: newStatus });
      await fetchArticles();
      toast({
        title: 'Success',
        description: `Article ${newStatus === 'published' ? 'published' : 'unpublished'} successfully.`,
      });
    } catch (error) {
      console.error('Failed to update article status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update article status.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-600">Create and manage articles</p>
        </div>
        <Button asChild>
          <Link href="/admin/articles/new">
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Link>
        </Button>
      </div>

      <ArticleTable
        articles={articles}
        onDelete={handleDelete}
        onStatusToggle={handleStatusToggle}
      />
    </div>
  );
}
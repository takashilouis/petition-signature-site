'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Article } from '@/types/admin';

interface ArticleTableProps {
  articles: Article[];
  onDelete: (id: string) => Promise<void>;
  onStatusToggle: (id: string, currentStatus: 'draft' | 'published') => Promise<void>;
}

export function ArticleTable({ articles, onDelete, onStatusToggle }: ArticleTableProps) {
  if (articles.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500 mb-4">No articles created yet</p>
          <Button asChild>
            <Link href="/admin/articles/new">Create First Article</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Articles ({articles.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {article.title}
                  </h3>
                  <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                    {article.status}
                  </Badge>
                </div>
                {article.excerpt && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>Slug: /{article.slug}</span>
                  <span>
                    Updated {formatDistanceToNow(new Date(article.updatedAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStatusToggle(article.id, article.status)}
                  title={article.status === 'published' ? 'Unpublish' : 'Publish'}
                >
                  {article.status === 'published' ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/articles/${article.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${article.title}"? This action cannot be undone.`)) {
                      onDelete(article.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
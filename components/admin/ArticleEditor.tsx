'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormActions } from '@/components/admin/FormActions';
import { MarkdownContent } from '@/components/MarkdownContent';
import { articleSchema, type ArticleForm } from '@/lib/admin-schemas';
import type { Article } from '@/types/admin';

interface ArticleEditorProps {
  article?: Article;
  onSave: (data: ArticleForm) => Promise<void>;
  isSaving: boolean;
  isNew: boolean;
}

export function ArticleEditor({ article, onSave, isSaving, isNew }: ArticleEditorProps) {
  const [originalData, setOriginalData] = useState<ArticleForm | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      bodyMarkdown: '',
      status: 'draft',
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (article) {
      const formData = {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt || '',
        bodyMarkdown: article.bodyMarkdown,
        status: article.status,
      };
      setOriginalData(formData);
      reset(formData);
    }
  }, [article, reset]);

  // Auto-generate slug from title
  useEffect(() => {
    if (isNew && watchedValues.title && !watchedValues.slug) {
      const slug = watchedValues.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  }, [watchedValues.title, watchedValues.slug, isNew, setValue]);

  const handleRevert = () => {
    if (originalData) {
      reset(originalData);
    } else {
      reset({
        title: '',
        slug: '',
        excerpt: '',
        bodyMarkdown: '',
        status: 'draft',
      });
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{isNew ? 'Create Article' : 'Edit Article'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSave)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register('title')}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                {...register('slug')}
                className={errors.slug ? 'border-red-500' : ''}
              />
              {errors.slug && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.slug.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt (Optional)</Label>
              <Textarea
                id="excerpt"
                {...register('excerpt')}
                rows={2}
                className={errors.excerpt ? 'border-red-500' : ''}
              />
              {errors.excerpt && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.excerpt.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={watchedValues.status}
                onValueChange={(value) => setValue('status', value as 'draft' | 'published')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bodyMarkdown">Content (Markdown)</Label>
              <Textarea
                id="bodyMarkdown"
                {...register('bodyMarkdown')}
                rows={12}
                className={errors.bodyMarkdown ? 'border-red-500' : ''}
                placeholder="Write your article content in Markdown..."
              />
              {errors.bodyMarkdown && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.bodyMarkdown.message}
                </p>
              )}
            </div>

            <div className="pt-4">
              <FormActions
                onSave={handleSubmit(onSave)}
                onRevert={handleRevert}
                isSaving={isSaving}
                hasChanges={isDirty}
                saveLabel={isNew ? 'Create Article' : 'Save Changes'}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="meta">Meta Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="mt-4">
              <div className="border rounded-lg p-4 bg-white min-h-[400px]">
                {watchedValues.title && (
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    {watchedValues.title}
                  </h1>
                )}
                {watchedValues.excerpt && (
                  <p className="text-gray-600 mb-6 italic">
                    {watchedValues.excerpt}
                  </p>
                )}
                {watchedValues.bodyMarkdown ? (
                  <MarkdownContent content={watchedValues.bodyMarkdown} />
                ) : (
                  <p className="text-gray-400">Start writing to see preview...</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="meta" className="mt-4">
              <div className="space-y-4 text-sm">
                <div>
                  <strong>URL:</strong> /{watchedValues.slug || 'article-slug'}
                </div>
                <div>
                  <strong>Status:</strong> {watchedValues.status}
                </div>
                <div>
                  <strong>Word Count:</strong> {watchedValues.bodyMarkdown?.split(/\s+/).length || 0}
                </div>
                <div>
                  <strong>Character Count:</strong> {watchedValues.bodyMarkdown?.length || 0}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
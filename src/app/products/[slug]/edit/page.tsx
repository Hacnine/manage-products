'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetProductsQuery, useUpdateProductMutation, useGetCategoriesQuery } from '@/store/api/productsApi';
import Layout from '@/components/Layout';
import ProductForm from '@/components/ProductForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductDetailSkeleton } from '@/components/LoadingSkeleton';
import { toast } from 'sonner';
import { useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';
  const token = useAppSelector((state) => state.auth?.token);
  const { data: products = [] } = useGetProductsQuery({ offset: 0, limit: 100 });
  const { data: categories = [] } = useGetCategoriesQuery();
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const product = products.find(p => p.slug === slug);

  const handleSubmit = async (data: any) => {
    if (!product) return;
    try {
      await updateProduct({ id: product.id, data }).unwrap();
      toast.success('Product updated successfully');
      router.push(`/products/${product.slug}`);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update product');
    }
  };

  if (!product) {
    return (
      <Layout>
        <ProductDetailSkeleton />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Product</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm initialData={product} categories={categories} onSubmit={handleSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
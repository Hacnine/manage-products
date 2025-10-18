'use client';

import { useRouter } from 'next/navigation';
import { useCreateProductMutation, useGetCategoriesQuery } from '@/store/api/apiSlice';
import Layout from '@/components/Layout';
import ProductForm from '@/components/ProductForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';

export default function CreateProductPage() {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth?.token);
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const handleSubmit = async (data: any) => {
    try {
      await createProduct(data).unwrap();
      toast.success('Product created successfully');
      router.push('/products');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create product');
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm categories={categories} onSubmit={handleSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
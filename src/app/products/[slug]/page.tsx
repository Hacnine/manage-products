'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useGetProductBySlugQuery, useGetCategoriesQuery, useDeleteProductMutation } from '@/store/api/apiSlice';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ConfirmDialog from '@/components/ConfirmDialog';
import { ProductDetailSkeleton } from '@/components/LoadingSkeleton';
import { formatPrice, formatRelativeTime } from '@/lib/formatters';
import { toast } from 'sonner';
import { useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';
  const token = useAppSelector((state) => state.auth?.token);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const { data: product, isLoading } = useGetProductBySlugQuery(slug || '');
  const { data: categories = [] } = useGetCategoriesQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const category = product ? categories.find((c) => c.id === product.categoryId) : null;

  const handleDelete = async () => {
    if (!product) return;
    
    try {
      await deleteProduct(product.id).unwrap();
      toast.success('Product deleted successfully');
      router.push('/products');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete product');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <ProductDetailSkeleton />
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-2">Product not found</h2>
          <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const images = product.images.length > 0 ? product.images : ['/placeholder.svg'];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link href="/products">
          <Button variant="ghost" className="gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted">
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-md border-2 transition-all ${
                      currentImageIndex === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-muted-foreground/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-4xl font-bold text-primary">{formatPrice(product.price)}</p>
            </div>

            {category && (
              <div>
                <span className="text-sm text-muted-foreground">Category</span>
                <div className="mt-1">
                  <Badge variant="secondary" className="text-sm">
                    {category.name}
                  </Badge>
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-border">
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{formatRelativeTime(product.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Updated</p>
                <p className="font-medium">{formatRelativeTime(product.updatedAt)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link href={`/products/${product.slug}/edit`} className="flex-1">
                <Button className="w-full gap-2">
                  <PencilIcon className="h-4 w-4" />
                  Edit Product
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(true)}
                className="gap-2 hover:bg-destructive hover:text-destructive-foreground"
              >
                <TrashIcon className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </Layout>
  );
}
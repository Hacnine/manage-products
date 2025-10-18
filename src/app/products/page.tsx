'use client';

import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useState, useEffect } from 'react';
import { useGetProductsQuery, useLazySearchProductsQuery, useGetCategoriesQuery, useDeleteProductMutation } from '@/store/api/productsApi';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import ConfirmDialog from '@/components/ConfirmDialog';
import { ProductCardSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Squares2X2Icon, CubeIcon, TagIcon, PlusCircleIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function ProductsPage() {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth?.token);
  
  useEffect(() => {
    // Only run auth check on client side to avoid hydration mismatch
    if (typeof window !== 'undefined' && !token) {
      router.push('/login');
    }
  }, [token, router]);
  
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: categories = [] } = useGetCategoriesQuery();
  
  const {
    data: products = [],
    isLoading,
    isFetching,
  } = useGetProductsQuery(
    { offset: currentPage * pageSize, limit: pageSize, categoryId: categoryFilter === "all" ? undefined : categoryFilter || undefined },
    { skip: searchQuery.length > 0 }
  );

  const [searchProducts, { data: searchResults = [], isLoading: isSearching }] = useLazySearchProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  useEffect(() => {
    if (searchQuery) {
      searchProducts(searchQuery);
    }
  }, [searchQuery, searchProducts]);

  useEffect(() => {
    setCurrentPage(0);
  }, [categoryFilter, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteProduct(deleteId).unwrap();
      toast.success('Product deleted successfully');
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete product');
    }
  };

  const displayProducts = searchQuery ? searchResults : products;
  const hasMore = !searchQuery && displayProducts.length === pageSize;
  const isLoadingData = isLoading || isFetching || isSearching;

  return (
    <Layout onSearch={handleSearch}>
      <div className="min-h-screen  dark:from-background dark:via-secondary/10 dark:to-primary/5">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg">
              <Squares2X2Icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-accent dark:from-foreground dark:via-primary dark:to-accent bg-clip-text text-transparent">
                Product Management
              </h1>
              <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Discover and manage your amazing product collection with style and elegance
              </p>
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Category:</span>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card dark:bg-card rounded-xl p-6 shadow-lg border border-border dark:border-border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <CubeIcon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground dark:text-card-foreground">{displayProducts.length}</p>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                </div>
              </div>
            </div>
            <div className="bg-card dark:bg-card rounded-xl p-6 shadow-lg border border-border dark:border-border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-secondary to-secondary/80 rounded-lg flex items-center justify-center">
                  <TagIcon className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground dark:text-card-foreground">{categories.length}</p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
              </div>
            </div>
            <div className="bg-card dark:bg-card rounded-xl p-6 shadow-lg border border-border dark:border-border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-accent to-accent/80 rounded-lg flex items-center justify-center">
                  <PlusCircleIcon className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground dark:text-card-foreground">New</p>
                  <p className="text-sm text-muted-foreground">Add Product</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="bg-card dark:bg-card rounded-xl p-6 shadow-lg border border-border dark:border-border">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-card-foreground dark:text-card-foreground mb-2">Your Products</h2>
                <p className="text-muted-foreground">Browse, edit, and manage your product catalog</p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <AdjustmentsHorizontalIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Filter by:</span>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48 bg-gradient-to-r from-secondary/20 to-primary/10 dark:from-secondary/10 dark:to-primary/5 border-primary/20 dark:border-primary/30">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {isLoadingData && displayProducts.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: pageSize }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : displayProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard
                      product={product}
                      categories={categories}
                      onDelete={setDeleteId}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {!searchQuery && (
                <div className="bg-card dark:bg-card rounded-xl p-6 shadow-lg border border-border dark:border-border">
                  <Pagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalItems={products.length + (hasMore ? 1 : 0) * pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(size) => {
                      setPageSize(size);
                      setCurrentPage(0);
                    }}
                    hasMore={hasMore}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              type={searchQuery ? 'no-results' : 'no-products'}
              onClearSearch={searchQuery ? () => setSearchQuery('') : undefined}
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </Layout>
  );
}
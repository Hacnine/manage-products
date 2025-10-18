import { PlusCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmptyStateProps {
  type: 'no-products' | 'no-results';
  onClearSearch?: () => void;
}

const EmptyState = ({ type, onClearSearch }: EmptyStateProps) => {
  if (type === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="p-4 bg-muted rounded-full mb-4">
          <MagnifyingGlassIcon className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground text-center mb-4">
          We couldn't find any products matching your search.
        </p>
        {onClearSearch && (
          <Button variant="outline" onClick={onClearSearch}>
            Clear Search
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="p-4 bg-muted rounded-full mb-4">
        <PlusCircleIcon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No products yet</h3>
      <p className="text-muted-foreground text-center mb-4">
        Get started by creating your first product.
      </p>
      <Link href="/products/new">
        <Button className="gap-2">
          <PlusCircleIcon className="h-5 w-5" />
          Create Product
        </Button>
      </Link>
    </div>
  );
};

export default EmptyState;

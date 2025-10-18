import Link from 'next/link';
import { PencilIcon, TrashIcon, EyeIcon, StarIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatRelativeTime } from '@/lib/formatters';
import type { Product, Category } from '@/store/api/productsApi';

interface ProductCardProps {
  product: Product;
  categories: Category[];
  onDelete: (id: string) => void;
}

const ProductCard = ({ product, categories, onDelete }: ProductCardProps) => {
  const category = categories.find((c) => c.id === product.categoryId);
  const thumbnail = (product.images && product.images.length > 0) ? product.images[0] : '/placeholder.svg';

  return (
    <Card className="group overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] relative">
      {/* Featured Badge */}
      <div className="absolute top-3 left-3 z-10">
        <Badge className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground border-0 shadow-lg">
          <StarIcon className="h-3 w-3 mr-1" />
          Featured
        </Badge>
      </div>

      {/* Image Container */}
      <div className="relative overflow-hidden">
        <Link href={`/products/${product.slug}`}>
          <div className="aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 relative">
            <img
              src={thumbnail}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Quick action overlay */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex gap-2">
            <Link href={`/products/${product.slug}/edit`}>
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-card/90 hover:bg-card shadow-lg border border-border">
                <PencilIcon className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="destructive"
              className="h-8 w-8 p-0 shadow-lg"
              onClick={() => onDelete(product.id)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Category Badge */}
        {category && (
          <div className="flex justify-end">
            <Badge variant="outline" className="text-xs bg-gradient-to-r from-secondary/20 to-primary/10 dark:from-secondary/10 dark:to-primary/5 border-primary/20 dark:border-primary/30">
              {category.name}
            </Badge>
          </div>
        )}

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-xl hover:text-primary transition-colors duration-200 line-clamp-2 group-hover:text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {formatPrice(product.price)}
            </p>
            <p className="text-xs text-muted-foreground">
              Created {formatRelativeTime(product.createdAt)}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link href={`/products/${product.slug}`} className="w-full">
          <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <EyeIcon className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

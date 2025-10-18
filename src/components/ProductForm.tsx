import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { isValidUrl } from '@/lib/formatters';
import type { Product } from '@/store/api/apiSlice';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  images: z.array(
    z.object({
      url: z.string().refine((url) => isValidUrl(url), 'Must be a valid URL')
    })
  ).min(1, 'At least one image is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  categoryId: z.string().min(1, 'Category is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
  categories: { id: string; name: string }[];
  onSubmit: (data: Omit<Product, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => void;
  isLoading: boolean;
}

const ProductForm = ({ initialData, categories, onSubmit, isLoading }: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      images: initialData?.images.map(url => ({ url })) || [{ url: '' }],
      price: initialData?.price || 0,
      categoryId: initialData?.categoryId || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  });

  const watchImages = watch('images');

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit({
      name: data.name,
      description: data.description,
      images: data.images.map(img => img.url),
      price: data.price,
      categoryId: data.categoryId,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Enter product name"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Enter product description"
          rows={4}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Price (USD) *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...register('price', { valueAsNumber: true })}
          placeholder="0.00"
          disabled={isLoading}
        />
        {errors.price && (
          <p className="text-sm text-destructive">{errors.price.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="categoryId">Category *</Label>
        <Select
          defaultValue={initialData?.categoryId}
          onValueChange={(value) => {
            const event = { target: { name: 'categoryId', value } };
            register('categoryId').onChange(event);
          }}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-sm text-destructive">{errors.categoryId.message}</p>
        )}
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label>Product Images *</Label>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      {...register(`images.${index}.url`)}
                      placeholder="https://example.com/image.jpg"
                      disabled={isLoading}
                    />
                    {errors.images?.[index]?.url && (
                      <p className="text-sm text-destructive">
                        {errors.images[index]?.url?.message}
                      </p>
                    )}
                  </div>
                  {watchImages[index]?.url && isValidUrl(watchImages[index].url) && (
                    <div className="w-16 h-16 rounded border border-border overflow-hidden flex-shrink-0">
                      <img
                        src={watchImages[index].url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  )}
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={isLoading}
                      className="flex-shrink-0"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {errors.images && !Array.isArray(errors.images) && (
          <p className="text-sm text-destructive">{errors.images.message}</p>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ url: '' })}
          disabled={isLoading}
          className="gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Image URL
        </Button>
      </div>

      {/* Submit Button */}
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;

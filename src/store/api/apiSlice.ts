import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

const API_BASE = 'https://api.bitechx.com';

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  categoryId: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface AuthResponse {
  token: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state?.auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Products', 'Product', 'Categories'],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation<AuthResponse, { email: string }>({
      query: (credentials) => ({
        url: '/auth',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Products
    getProducts: builder.query<Product[], { offset?: number; limit?: number; categoryId?: string }>({
      query: ({ offset = 0, limit = 10, categoryId }) => {
        let url = `/products?offset=${offset}&limit=${limit}`;
        if (categoryId) {
          url += `&categoryId=${categoryId}`;
        }
        return url;
      },
      providesTags: ['Products'],
    }),

    getProductBySlug: builder.query<Product, string>({
      query: (slug) => `/products/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: 'Product', id: slug }],
    }),

    searchProducts: builder.query<Product[], string>({
      query: (searchText) => `/products/search?searchedText=${encodeURIComponent(searchText)}`,
      providesTags: ['Products'],
    }),

    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Products'],
    }),

    updateProduct: builder.mutation<Product, { id: string; data: Partial<Product> }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products', 'Product'],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),

    // Categories
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
} = apiSlice;

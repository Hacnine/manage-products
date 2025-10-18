'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginMutation } from '@/store/api/productsApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { toast } from 'sonner';
import { Squares2X2Icon } from '@heroicons/react/24/outline';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login({ email: data.email }).unwrap();
      dispatch(setCredentials({ token: response.token, email: data.email }));
      toast.success('Login successful!');
      router.push('/products');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card p-6 rounded-lg shadow-lg border border-border">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-[#4E6E5D] rounded-lg">
              <Squares2X2Icon className="h-8 w-8 text-[#EFF1F3]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#0D1821]">Product Manager</h1>
          <p className="text-[#AD8A64]">Sign in to manage your products</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-[#0D1821]">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4E6E5D] focus:border-[#4E6E5D]"
            />
            {errors.email && (
              <p className="text-sm text-[#A44A3F]">{errors.email.message}</p>
            )}
          </div>

          <button type="submit" className="w-full bg-[#4E6E5D] text-[#EFF1F3] py-2 px-4 rounded-md hover:bg-[#3d5a4a] disabled:opacity-50 transition-colors" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center text-sm text-[#AD8A64]">
            <p>Demo: Use any valid email format</p>
            <p className="mt-1 text-xs">e.g., demo@example.com</p>
          </div>
        </form>
      </div>
    </div>
  );
}
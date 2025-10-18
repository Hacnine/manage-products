'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { MagnifyingGlassIcon, UserCircleIcon, Squares2X2Icon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface LayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
}

const Layout = ({ children, onSearch }: LayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.auth?.email || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (onSearch && debouncedSearch !== undefined) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/products" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-lg font-semibold text-foreground hidden sm:inline">Product Manager</span>
            </Link>

            {/* Desktop Search */}
            {pathname === '/products' && (
              <div className="hidden md:flex flex-1 max-w-md">
                <div className="relative w-full">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            )}

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <UserCircleIcon className="h-5 w-5" />
                <span className="hidden md:inline">{isHydrated ? email : ''}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          {pathname === '/products' && (
            <div className="md:hidden mt-3">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Secondary Navigation */}
      <nav className="bg-muted border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1">
            <Link href="/products">
              <Button
                variant={isActive('/products') ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-2"
              >
                <Squares2X2Icon className="h-4 w-4" />
                Products
              </Button>
            </Link>
            <Link href="/products/new">
              <Button
                variant={isActive('/products/new') ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-2"
              >
                <PlusCircleIcon className="h-4 w-4" />
                Create Product
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;

'use client';
import ClassicLayout from '@/layouts/classic/layout';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('crypto-user');
      if (!user) {
        router.push('/authentication');
      }
    }
  }, [router]);
  return <ClassicLayout>{children}</ClassicLayout>;
}

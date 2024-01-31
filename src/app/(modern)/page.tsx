'use client';
import ModernScreen from '@/components/screens/modern-screen';
import ClassicScreen from '@/components/screens/classic-screen';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function IndexPageModern() {
  const router = useRouter();
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('auth');
    if (!isAuthenticated) {
      router.push('/authentication');
    }
  }, []);
  return <ClassicScreen />;
}

'use client';
import ModernScreen from '@/components/screens/modern-screen';
import ClassicScreen from '@/components/screens/classic-screen';
import { useEffect } from 'react';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

// Import your screen components here

export default function IndexPageModern() {
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // If user is not authenticated, redirect to the authentication page
        router.push('/authentication');
      }
    });

    // Unsubscribe from the auth state listener to avoid memory leaks
    return () => unsubscribe();
  }, [router]);

  return <ClassicScreen />;
}

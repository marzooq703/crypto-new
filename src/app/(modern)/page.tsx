'use client';
import ModernScreen from '@/components/screens/modern-screen';
import ClassicScreen from '@/components/screens/classic-screen';
import { useState } from 'react';
import { useEffect } from 'react';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import LoadingScreen from '../../components/Loading/page';
// import GeoFencing from '@/components/geoFencing/page';

// Import your screen components here

export default function IndexPageModern() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false); // Set loading to false once authentication state is determined
      if (!user) {
        router.push('/authentication');
      }
    });

    // Unsubscribe from the auth state listener to avoid memory leaks
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {/* <GeoFencing/> */}
      <ClassicScreen />
    </>
  );
}

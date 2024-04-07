'use client';
// import GeoFencing from '@/components/geoFencing/page';
import ClassicScreen from '@/components/screens/classic-screen';
import { useEffect } from 'react';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

export default function IndexPageClassic() {
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

  return (
    <>
      {/* <GeoFencing /> */}
      <ClassicScreen />
    </>
  );
}

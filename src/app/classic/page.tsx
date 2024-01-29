'use client';
import { useEffect } from 'react';
import GeoFencing from '@/components/geoFencing/page';
import ClassicScreen from '@/components/screens/classic-screen';
import { useRouter } from 'next/router';

export default function IndexPageClassic() {
  const router = useRouter();

  useEffect(() => {
    // Check for authentication or other conditions before allowing access
    const isAuthenticated = localStorage.getItem('auth');
    if (!isAuthenticated) {
      router.push('/signin'); // Redirect to sign-in page if not authenticated
    }
  }, []);

  return (
    <>
      <GeoFencing />
      <ClassicScreen />;
    </>
  );
}

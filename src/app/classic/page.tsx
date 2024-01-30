'use client';
import { useEffect } from 'react';
import GeoFencing from '@/components/geoFencing/page';
import ClassicScreen from '@/components/screens/classic-screen';
import { useRouter } from 'next/router';

export default function IndexPageClassic() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('auth');
    if (!isAuthenticated) {
      router.push('/authentication');
    }
  }, []);

  return (
    <>
      <GeoFencing />
      <ClassicScreen />;
    </>
  );
}

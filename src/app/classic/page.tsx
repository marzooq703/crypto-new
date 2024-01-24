'use client';
import { useEffect } from 'react';
import GeoFencing from '@/components/geoFencing/page';
import ClassicScreen from '@/components/screens/classic-screen';

export default function IndexPageClassic() {
  return (
    <>
      <GeoFencing />
      <ClassicScreen />;
    </>
  );
}

import ClassicLayout from '@/layouts/classic/layout';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  // const router = useRouter();

  return <ClassicLayout>{children}</ClassicLayout>;
}

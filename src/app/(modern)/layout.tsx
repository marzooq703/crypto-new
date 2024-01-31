import ModernLayout from '@/layouts/modern/layout';
import ClassicLayout from '@/layouts/classic/layout';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClassicLayout>{children}</ClassicLayout>;
}

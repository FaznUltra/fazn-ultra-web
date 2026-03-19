import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function RootAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <ResponsiveLayout>{children}</ResponsiveLayout>
    </ProtectedRoute>
  );
}

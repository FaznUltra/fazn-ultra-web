import { MobileLayout } from '@/components/layout/MobileLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function RootAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <MobileLayout>{children}</MobileLayout>
    </ProtectedRoute>
  );
}

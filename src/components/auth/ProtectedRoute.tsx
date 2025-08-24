// No imports needed

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Always allow access
  return <>{children}</>;
}
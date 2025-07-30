import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';

const AdminRoute = () => {
  const { user, isAuthenticated, loading, refreshUser } = useAuth();

  // Debug logging
  console.log('AdminRoute - Auth State:', { user, isAuthenticated, loading });
  console.log('AdminRoute - User role:', user?.role);
  console.log('AdminRoute - localStorage user:', localStorage.getItem('user'));

  // Refresh user data to ensure we have the latest role
  useEffect(() => {
    if (isAuthenticated && !user?.role) {
      console.log('AdminRoute - Refreshing user data to get role');
      refreshUser();
    }
  }, [isAuthenticated, user?.role, refreshUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('AdminRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    console.log('AdminRoute - Not admin, redirecting to home. User role:', user?.role);
    return <Navigate to="/" replace />;
  }

  console.log('AdminRoute - Admin access granted');
  return <Outlet />;
};

export default AdminRoute; 
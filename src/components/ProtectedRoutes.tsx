import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
}; 
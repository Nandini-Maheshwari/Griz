import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // If still checking authentication status, show loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
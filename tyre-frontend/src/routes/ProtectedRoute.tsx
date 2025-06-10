import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  const userRole = localStorage.getItem('userRole');
    const location = useLocation();

  if (!isAuthenticated) {
    // Kullanıcı giriş yapmamışsa, login sayfasına yönlendir
    return <Navigate to="/login" state={{ from: location }} replace />;
                }

  // Kullanıcı rolü kontrolü
  const isUserRoute = location.pathname.startsWith('/dashboard') || 
                     location.pathname.startsWith('/appointments') || 
                     location.pathname.startsWith('/vehicles') || 
                     location.pathname.startsWith('/favorites') || 
                     location.pathname.startsWith('/history') || 
                     location.pathname.startsWith('/reviews') || 
                     location.pathname.startsWith('/profile') || 
                     location.pathname.startsWith('/settings') || 
                     location.pathname.startsWith('/service-request');
                     
  const isShopRoute = location.pathname.startsWith('/shop-');

  if (userRole === 'USER' && isShopRoute) {
    return <Navigate to="/dashboard" replace />;
  }

  if (userRole === 'SHOP' && isUserRoute) {
    return <Navigate to="/shop-dashboard" replace />;
  }

  // Rol tanımlı değilse, güvenli bir şekilde çıkış yap
  if (!userRole) {
                localStorage.clear();
    return <Navigate to="/login" replace />;
    }

        return <Outlet />;
};

export default ProtectedRoute;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import HistoryPage from './pages/customer/HistoryPage';
import ReviewsPage from './pages/customer/ReviewsPage';
import ProfilePage from './pages/customer/ProfilePage';
import SettingsPage from './pages/customer/SettingsPage';
import ServiceRequestPage from './pages/customer/ServiceRequestPage';
import AppointmentsPage from './pages/customer/AppointmentsPage';
import VehiclesPage from './pages/customer/VehiclesPage';
import FavoritesPage from './pages/customer/FavoritesPage';

// Shop Pages
import ShopDashboard from './pages/shop/ShopDashboard';
import ShopAppointments from './pages/shop/ShopAppointments';
import ShopCustomers from './pages/shop/ShopCustomers';
import ShopInventory from './pages/shop/ShopInventory';
import ShopRevenue from './pages/shop/ShopRevenue';
import ShopServices from './pages/shop/ShopServices';
import ShopHistory from './pages/shop/ShopHistory';
import ShopReviews from './pages/shop/ShopReviews';
import ShopSettings from './pages/shop/ShopSettings';

import ProtectedRoute from './routes/ProtectedRoute';
import Sidebar from './components/Sidebar';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userRole = localStorage.getItem('userRole');

  if (userRole === 'SHOP') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  const userRole = localStorage.getItem('userRole');

  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    if (userRole === 'SHOP') return '/shop-dashboard';
    if (userRole === 'USER') return '/dashboard';
    localStorage.clear();
    return '/login';
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          !isAuthenticated ? <LoginPage /> : <Navigate to={getDefaultRoute()} replace />
        } />
        <Route path="/register" element={
          !isAuthenticated ? <RegisterPage /> : <Navigate to={getDefaultRoute()} replace />
        } />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Customer Routes */}
          <Route path="/dashboard" element={
            userRole === 'USER' ? (
              <AppLayout>
                <CustomerDashboard />
              </AppLayout>
            ) : <Navigate to={getDefaultRoute()} replace />
          } />
          <Route path="/appointments" element={
            userRole === 'USER' ? (
              <AppLayout>
                <AppointmentsPage />
              </AppLayout>
            ) : <Navigate to={getDefaultRoute()} replace />
          } />
          <Route path="/vehicles" element={
            userRole === 'USER' ? (
              <AppLayout>
                <VehiclesPage />
              </AppLayout>
            ) : <Navigate to={getDefaultRoute()} replace />
          } />
          <Route path="/favorites" element={
            userRole === 'USER' ? (
              <AppLayout>
                <FavoritesPage />
              </AppLayout>
            ) : <Navigate to={getDefaultRoute()} replace />
          } />
          <Route path="/history" element={
            userRole === 'USER' ? (
              <AppLayout>
                <HistoryPage />
              </AppLayout>
            ) : <Navigate to={getDefaultRoute()} replace />
          } />
          <Route path="/reviews" element={
            userRole === 'USER' ? (
              <AppLayout>
                <ReviewsPage />
              </AppLayout>
            ) : <Navigate to={getDefaultRoute()} replace />
          } />
          <Route path="/service-requests" element={
            userRole === 'USER' ? (
              <AppLayout>
                <ServiceRequestPage />
              </AppLayout>
            ) : <Navigate to={getDefaultRoute()} replace />
          } />
          <Route path="/profile" element={
            userRole === 'USER' ? (
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            ) : <Navigate to={getDefaultRoute()} replace />
          } />
          <Route path="/settings" element={
            userRole === 'USER' ? (
              <AppLayout>
                <SettingsPage />
              </AppLayout>
            ) : <Navigate to={getDefaultRoute()} replace />
          } />

          {/* Shop Routes */}
          <Route path="/shop-dashboard" element={
            userRole === 'SHOP' ? <ShopDashboard /> : <Navigate to={getDefaultRoute()} replace />
          } />
          <Route path="/shop-appointments" element={
            userRole === 'SHOP' ? <ShopAppointments /> : <Navigate to={getDefaultRoute()} replace />
          } />
          <Route path="/shop-customers" element={
            userRole === 'SHOP' ? <ShopCustomers /> : <Navigate to={getDefaultRoute()} replace />
          } />
          <Route path="/shop-inventory" element={
            userRole === 'SHOP' ? <ShopInventory /> : <Navigate to={getDefaultRoute()} replace />
          } />
          <Route path="/shop-revenue" element={
            userRole === 'SHOP' ? <ShopRevenue /> : <Navigate to={getDefaultRoute()} replace />
          } />
          <Route path="/shop-services" element={
            userRole === 'SHOP' ? <ShopServices /> : <Navigate to={getDefaultRoute()} replace />
          } />
          <Route path="/shop-history" element={
            userRole === 'SHOP' ? <ShopHistory /> : <Navigate to={getDefaultRoute()} replace />
          } />
          <Route path="/shop-reviews" element={
            userRole === 'SHOP' ? <ShopReviews /> : <Navigate to={getDefaultRoute()} replace />
          } />
          <Route path="/shop-settings" element={
            userRole === 'SHOP' ? <ShopSettings /> : <Navigate to={getDefaultRoute()} replace />
          } />
        </Route>

        {/* Root Route */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

        {/* Catch all undefined routes */}
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </Router>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Listing from './pages/Listing';
import ItemDetail from './pages/ItemDetail';
import AddItem from './pages/AddItem';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes (with navbar/footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/items" element={<Listing />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          
          {/* Protected Routes (require authentication) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          
          {/* Admin Routes (require admin role) */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* Auth Routes (no navbar/footer) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;

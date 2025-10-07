// src/routes/Routes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MainPage from "./pages/MainPage"

import ProtectedRoute from './utils/ProtectedRoute';
import PublicRoute from './utils/PublicRoute';
import Register from './pages/Register';
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails';
import Cart from './pages/Cart'
import Checkout from './pages/Checkout';

export default function AppRoutes() {

  return (
    <Routes>

      <Route path="/login" element={
        <PublicRoute>

          <Login />
        </PublicRoute>
      } />
      <Route path="/" element={

        <MainPage />
      } />

      <Route path="/register" element={
        <PublicRoute>

          <Register />
        </PublicRoute>
      } />

      <Route path="/courses" element={

        <Courses />

      } />

      <Route path="/courses/:courseID"
        element={
          <CourseDetails />

        }
      />


      <Route path="/cart" element={
        <ProtectedRoute>
          <Cart />

        </ProtectedRoute>

      } />

      
      <Route path="/checkout" element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>

      } />


      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
